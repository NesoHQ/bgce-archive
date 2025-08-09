package main

import (
    "fmt"
    "math/rand"
    "os"
    "bufio"
    "strings"
)

func ascii_art(){

	asciiArt := map[string]string{
		"Rock": `
    _______
---'   ____)
      (_____)
      (_____)
      (____)
---.__(___)`,
		"Paper": `
     _______
---'    ____)____
           ______)
          _______)
         _______)
---.__________)`,
		"Scissors": `
    _______
---'   ____)____
          ______)
       __________)
      (____)
---.__(___)`,
		"Lizard": `
      __,_
     (o 0)  < Sss!
  /|/  *  \|
  //      \\
 ^^        ^^`,
		"Spock": `
      _______
---'   ____ )
     (      )   🖖
     (______)
      (____)
---.__(___)`,
	}

	fmt.Println("Choose your move:")
	for name, art := range asciiArt {
		fmt.Println(name)
		fmt.Println(art)
		fmt.Println()
    }

}

func welcome(){
    fmt.Println("Welcome to the game of Rock, Paper, Scissor, Lizard, Spock")
    fmt.Println("There is two version of this game. One is the traditional Rock-Paper-Scissor")
    fmt.Println("Another one is the more complex version of it known as Rock-Paper-Scissor-Lizard-Spock")
    fmt.Println("The game Rock-Paper-Scissors-Lizard-Spock was invented by Sam Kass and Karen Bryla as an extension of the classic Rock-Paper-Scissors game.")
    fmt.Println("It was designed to reduce the number of ties by adding two additional hand gestures: Lizard and Spock.")
    fmt.Println("Anyway enough with the lore. Let's play the game now")
}



func rules() {
    reader := bufio.NewReader(os.Stdin)
    
    for {
        fmt.Print("\nDo you want to read the rules? [y/n]: ")
        choice, _ := reader.ReadString('\n')
        choice = strings.TrimSpace(strings.ToLower(choice))

        if choice == "y" {
            fmt.Println("\nSheldon explains:")
            fmt.Println("Scissors cuts Paper, Paper covers Rock, Rock crushes Lizard, Lizard poisons Spock,")
            fmt.Println("Spock smashes Scissors, Scissors decapitates Lizard, Lizard eats Paper,")
            fmt.Println("Paper disproves Spock, Spock vaporizes Rock, and as always, Rock crushes Scissors.")
            fmt.Println("\nAlright, now let's play!")
            break
        } else if choice == "n" {
            fmt.Println("\nSkipping rules... Let's play!")
            break
        } else {
            fmt.Println("Invalid input. Please enter 'y' or 'n'.")
        }
    }
}



func isValidMove(move string) bool {
    validMoves := []string{"Rock", "Paper", "Scissors", "Lizard", "Spock"}
    for _, valid := range validMoves {
        if strings.EqualFold(move, valid) { 
            return true
        }
    }
    return false
}


func input() string {
    reader := bufio.NewReader(os.Stdin)

    for {
        fmt.Print("Enter your move (Rock, Paper, Scissors, Lizard, Spock): ")
        userChoice, _ := reader.ReadString('\n')
        userChoice = strings.TrimSpace(userChoice) // Remove newline & spaces

        if isValidMove(userChoice) {
            // Normalize to lowercase before title casing
            return strings.Title(strings.ToLower(userChoice)) // Capitalize first letter only
        } else {
            fmt.Println("Invalid move! Please enter Rock, Paper, Scissors, Lizard, or Spock.")
        }
    }
}




func computerMove() string {
	moves := []string{"Rock", "Paper", "Scissors", "Lizard", "Spock"}
	randomIndex := rand.Intn(len(moves))

	return moves[randomIndex]
}

func whoIsWinner(userMove, computerMove string) string {
	if userMove == computerMove {
		return "draw"
	}

	if (userMove == "Rock" && (computerMove == "Scissors" || computerMove == "Lizard")) ||
		(userMove == "Paper" && (computerMove == "Rock" || computerMove == "Spock")) ||
		(userMove == "Scissors" && (computerMove == "Paper" || computerMove == "Lizard")) ||
		(userMove == "Lizard" && (computerMove == "Spock" || computerMove == "Paper")) ||
		(userMove == "Spock" && (computerMove == "Scissors" || computerMove == "Rock")) {
		return "You won! Congratulations!"
	}

	return "You lost! Hahaha, you suck!"
}

func loopGame() {
	for {
		computerMove := computerMove()

		userMove := input()

		fmt.Println("You chose:", userMove)
		fmt.Println("Computer chose:", computerMove)

		
		result := whoIsWinner(userMove, computerMove)

		
		if result == "draw" {
			fmt.Println("Damn, it's a draw. Let's play again!")
			fmt.Println()
			continue
		}

		
		fmt.Println(result)
		break
	}
}

 


func main(){
    ascii_art()
    welcome()
    rules()
    loopGame()
}