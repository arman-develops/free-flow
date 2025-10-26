package main

import (
	"fmt"
	"free-flow-api/config"
	"time"
)

func main() {
	// data := utils.OnboardingData{
	// 	FullName:    "Declan Rice",
	// 	AssociateID: uuid.MustParse("f7f89209-253c-4f8b-a244-0efbd8b605ce"),
	// }

	// token, err := utils.CreateOnboardingToken(data)
	// if err != nil {
	// 	fmt.Print("could not create token", err)
	// }

	// fmt.Println(token)

	// generate invite token
	token, err := config.GenerateInviteToken("8446539b-33c9-432d-87c1-e71621ab5d32", "7f13de47-aa3d-4339-aaef-8cef4333b4be", "0cf21213-495c-4a4d-842e-84fd37b29c2d", "5b941f2a-2faf-49e9-9a9e-e6bf5c9f92ed", 72*time.Hour)
	if err != nil {
		fmt.Print(err.Error())
	}

	//send mail to associate right after
	fmt.Println(token)
}
