package userEntity

type User struct {
	Id                 int    `json:"id"`
	Username           string `json:"username"`
	Password           string `json:"password"`
	Bio                string `json:"bio"`
	Email              string `json:"email"`
	PhoneNumber       string `json:"phone_number"`
	LanguagePreference string `json:"language_preference"`
	ProfilePicture     string `json:"profile_picture"`
}