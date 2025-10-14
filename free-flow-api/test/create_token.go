package main

import (
	"fmt"
	"free-flow-api/utils"

	"github.com/google/uuid"
)

func main() {
	data := utils.OnboardingData{
		FullName:    "Declan Rice",
		AssociateID: uuid.MustParse("f7f89209-253c-4f8b-a244-0efbd8b605ce"),
	}

	token, err := utils.CreateOnboardingToken(data)
	if err != nil {
		fmt.Print("could not create token", err)
	}

	fmt.Println(token)
}
