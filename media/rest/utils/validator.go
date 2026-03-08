package utils

import (
	"errors"
	"reflect"
	"strings"

	"github.com/go-playground/locales"
	"github.com/go-playground/locales/en"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	en_translations "github.com/go-playground/validator/v10/translations/en"
	"github.com/shopspring/decimal"
)

type Validator struct {
	en       locales.Translator
	uniTrans *ut.UniversalTranslator
	trans    ut.Translator
	validate *validator.Validate
}

var val *Validator

const (
	SyncWithGeomap     = "geo_map"
	SyncWithRouteMap   = "route_map"
	SyncWithTileEngine = "tile_engine"
	SyncWithAll        = "all"
)

func ValidateSyncFor(fl validator.FieldLevel) bool {
	syncFor := strings.ToLower(fl.Field().String())
	switch syncFor {
	case SyncWithAll, SyncWithGeomap, SyncWithRouteMap, SyncWithTileEngine:
		return true
	default:
		return false
	}
}

func InitValidator() {
	val = &Validator{}
	val.en = en.New()
	val.uniTrans = ut.New(val.en, val.en)
	val.trans, _ = val.uniTrans.GetTranslator("en")
	val.validate = validator.New()
	en_translations.RegisterDefaultTranslations(val.validate, val.trans)
	val.validate.RegisterValidation("syncFor", ValidateSyncFor)
	val.validate.RegisterValidation("lat", latValidation)
	val.validate.RegisterValidation("lon", lonValidation)
	val.validate.RegisterValidation("allowedStatus",
		statusValidation([]string{
			"PendingReview",
			"NoChangesNeeded",
			"Fixed",
			"ReviewInProgress",
		}))
}

func Validate(v interface{}) error {
	vValue := reflect.ValueOf(v)
	if vValue.Kind() == reflect.Slice {
		for i := 0; i < vValue.Len(); i++ {
			if err := val.validate.Struct(vValue.Index(i).Interface()); err != nil {
				return errors.New("validation error: " + err.Error())
			}
		}
	} else {
		if err := val.validate.Struct(v); err != nil {
			return errors.New("validation error: " + err.Error())
		}
	}
	return nil
}

func TranslateError(e error) validator.ValidationErrorsTranslations {
	valErr, ok := e.(validator.ValidationErrors)
	if !ok {
		return validator.ValidationErrorsTranslations{
			"error": e.Error(),
		}
	}
	return valErr.Translate(val.trans)
}

func latValidation(fl validator.FieldLevel) bool {
	val, ok := fl.Field().Interface().(decimal.Decimal)
	if !ok {
		return false

	}
	// Check if latitude is between -90 and 90
	return val.Cmp(decimal.NewFromFloat(-90)) >= 0 && val.Cmp(decimal.NewFromFloat(90)) <= 0
}

func lonValidation(fl validator.FieldLevel) bool {
	val, ok := fl.Field().Interface().(decimal.Decimal)
	if !ok {
		return false
	}
	// Check if longitude is between -180 and 180
	return val.Cmp(decimal.NewFromFloat(-180)) >= 0 && val.Cmp(decimal.NewFromFloat(180)) <= 0
}

func statusValidation(allowedStatuses []string) validator.Func {
	// Return a closure that performs the validation
	return func(fl validator.FieldLevel) bool {
		for _, status := range allowedStatuses {
			if fl.Field().String() == status {
				return true
			}
		}
		return false
	}
}
