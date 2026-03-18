package domain

type Roadmap struct {
	CompletedCards  []CompletedCard  `json:"completedCards" bson:"completedCards"`
	InProgressCards []InProgressCard `json:"inProgressCards" bson:"inProgressCards"`
	PlannedCards    []PlannedCard    `json:"plannedCards" bson:"plannedCards"`
	ChangeLogCards  []ChangeLogCard  `json:"changeLogCards" bson:"changeLogCards"`
}
