package cache

import (
	"context"
	"testing"

	mock_cache "cortex/cache/mock"

	"github.com/stretchr/testify/require"
)

func TestRedisSetGet(t *testing.T) {
	mockClient := new(mock_cache.Client)

	for _, tc := range mock_cache.CacheTestData(t, mockClient) {
		t.Run(tc.Name, func(t *testing.T) {
			mockClient.ExpectedCalls = nil
			tc.MockSetup()

			err := mockClient.Set(context.Background(), tc.Key, tc.Value, 0)
			if tc.SetError != nil {
				require.EqualError(t, err, tc.SetError.Error())
				return
			} else {
				require.NoError(t, err)
			}

			result, err := mockClient.Get(context.Background(), tc.Key)
			if tc.GetError != nil {
				require.EqualError(t, err, tc.GetError.Error())
				return
			} else {
				require.NoError(t, err)
				require.Equal(t, tc.Value, result)
			}

			err = mockClient.Del(context.Background(), tc.Key)
			if tc.DelError != nil {
				require.EqualError(t, err, tc.DelError.Error())
				return
			} else {
				require.NoError(t, err)
			}

			mockClient.AssertExpectations(t)
		})
	}
}
