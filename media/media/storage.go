package media

import (
	"context"
	"fmt"
	"io"
	"log/slog"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type minioStorage struct {
	client     *minio.Client
	bucketName string
	cdnBaseURL string
}

// MinIOConfig holds MinIO configuration
type MinIOConfig struct {
	Endpoint   string
	AccessKey  string
	SecretKey  string
	UseSSL     bool
	BucketName string
	Region     string
	CDNBaseURL string
}

// NewMinIOStorage creates a new MinIO storage provider
func NewMinIOStorage(config MinIOConfig) (StorageProvider, error) {
	// Initialize MinIO client
	client, err := minio.New(config.Endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(config.AccessKey, config.SecretKey, ""),
		Secure: config.UseSSL,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create MinIO client: %w", err)
	}

	// Check if bucket exists, create if not
	ctx := context.Background()
	exists, err := client.BucketExists(ctx, config.BucketName)
	if err != nil {
		return nil, fmt.Errorf("failed to check bucket existence: %w", err)
	}

	if !exists {
		err = client.MakeBucket(ctx, config.BucketName, minio.MakeBucketOptions{
			Region: config.Region,
		})
		if err != nil {
			return nil, fmt.Errorf("failed to create bucket: %w", err)
		}
		slog.Info("Created MinIO bucket", "bucket", config.BucketName)
	}

	// Set bucket policy to public read (optional, for CDN access)
	policy := fmt.Sprintf(`{
		"Version": "2012-10-17",
		"Statement": [
			{
				"Effect": "Allow",
				"Principal": {"AWS": ["*"]},
				"Action": ["s3:GetObject"],
				"Resource": ["arn:aws:s3:::%s/*"]
			}
		]
	}`, config.BucketName)

	err = client.SetBucketPolicy(ctx, config.BucketName, policy)
	if err != nil {
		slog.Warn("Failed to set bucket policy", "error", err)
	}

	return &minioStorage{
		client:     client,
		bucketName: config.BucketName,
		cdnBaseURL: config.CDNBaseURL,
	}, nil
}

// Upload uploads a file to MinIO
func (s *minioStorage) Upload(ctx context.Context, path string, reader io.Reader, size int64, contentType string) (string, error) {
	_, err := s.client.PutObject(
		ctx,
		s.bucketName,
		path,
		reader,
		size,
		minio.PutObjectOptions{
			ContentType: contentType,
		},
	)
	if err != nil {
		return "", fmt.Errorf("failed to upload file: %w", err)
	}

	url := s.GetURL(path)
	slog.Info("File uploaded successfully", "path", path, "url", url)

	return url, nil
}

// Download downloads a file from MinIO
func (s *minioStorage) Download(ctx context.Context, path string) (io.ReadCloser, error) {
	object, err := s.client.GetObject(ctx, s.bucketName, path, minio.GetObjectOptions{})
	if err != nil {
		return nil, fmt.Errorf("failed to download file: %w", err)
	}

	return object, nil
}

// Delete deletes a file from MinIO
func (s *minioStorage) Delete(ctx context.Context, path string) error {
	err := s.client.RemoveObject(ctx, s.bucketName, path, minio.RemoveObjectOptions{})
	if err != nil {
		return fmt.Errorf("failed to delete file: %w", err)
	}

	slog.Info("File deleted successfully", "path", path)
	return nil
}

// GetURL returns the public URL for a file
func (s *minioStorage) GetURL(path string) string {
	if s.cdnBaseURL != "" {
		return fmt.Sprintf("%s/%s/%s", s.cdnBaseURL, s.bucketName, path)
	}
	return fmt.Sprintf("https://%s/%s/%s", s.client.EndpointURL().Host, s.bucketName, path)
}
