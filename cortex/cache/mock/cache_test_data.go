package mock_cache

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/mock"
)

type CacheTest struct {
	Name      string
	Key       string
	Value     string
	MockSetup func()
	SetError  error
	GetError  error
	DelError  error
}

func CacheTestData(t *testing.T, mockClient *Client) []CacheTest {
	Tests := []CacheTest{
		{
			Name:  "success",
			Key:   "a",
			Value: "one",
			MockSetup: func() {
				mockClient.
					On("Set", mock.Anything, "a", "one", mock.Anything).
					Return(nil).
					Once()

				mockClient.
					On("Get", mock.Anything, "a").
					Return("one", nil).
					Once()

				mockClient.
					On("Del", mock.Anything, "a").
					Return(nil).
					Once()
			},
			SetError: nil,
			GetError: nil,
			DelError: nil,
		},
		{
			Name:  "set failure",
			Key:   "b",
			Value: "two",
			MockSetup: func() {
				mockClient.
					On("Set", mock.Anything, "b", "two", mock.Anything).
					Return(errors.New("failed to set value")).
					Once()
			},
			SetError: errors.New("failed to set value"),
			GetError: nil,
			DelError: nil,
		},
		{
			Name:  "get non existing",
			Key:   "c",
			Value: "",
			MockSetup: func() {
				mockClient.
					On("Set", mock.Anything, "c", mock.Anything, mock.Anything).
					Return(nil).
					Once()

				mockClient.
					On("Get", mock.Anything, "c").
					Return("", nil).
					Once()

				mockClient.
					On("Del", mock.Anything, "c").
					Return(nil).
					Once()
			},
			SetError: nil,
			GetError: nil,
			DelError: nil,
		},
		{
			Name:  "get failure",
			Key:   "c",
			Value: "three",
			MockSetup: func() {
				mockClient.
					On("Set", mock.Anything, "c", "three", mock.Anything).
					Return(nil).
					Once()

				mockClient.
					On("Get", mock.Anything, "c").
					Return("", errors.New("failed to get value")).
					Once()
			},
			SetError: nil,
			GetError: errors.New("failed to get value"),
			DelError: nil,
		},
		{
			Name:  "test:case:4",
			Key:   "d",
			Value: "four",
			MockSetup: func() {
				mockClient.
					On("Set", mock.Anything, "d", "four", mock.Anything).
					Return(nil).
					Once()

				mockClient.
					On("Get", mock.Anything, "d").
					Return("four", nil).
					Once()

				mockClient.
					On("Del", mock.Anything, "d").
					Return(errors.New("failed to delete value")).
					Once()
			},
			SetError: nil,
			GetError: nil,
			DelError: errors.New("failed to delete value"),
		},
	}

	return Tests
}
