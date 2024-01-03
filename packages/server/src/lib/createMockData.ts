import { prisma } from "@/lib/prismaClient";
import { shuffleArray } from "./utils/funcs";

const newQuiz = [];

export const quizesData = [{
    "question": "A flashing red traffic light signifies that a driver should do what?",
    "A": "stop",
    "B": "speed up",
    "C": "proceed with caution",
    "D": "honk the horn",
    "answer": "A"
}, {
    "question": "A knish is traditionally stuffed with what filling?",
    "A": "potato",
    "B": "creamed corn",
    "C": "lemon custard",
    "D": "raspberry jelly",
    "answer": "A"
}, {
    "question": "A pita is a type of what?",
    "A": "fresh fruit",
    "B": "flat bread",
    "C": "French tart",
    "D": "friend bean dip",
    "answer": "B"
}, {
    "question": "A portrait that comically exaggerates a person's physical traits is called a what?",
    "A": "landscape",
    "B": "caricature",
    "C": "still life",
    "D": "Impressionism",
    "answer": "B"
}, {
    "question": "A second-year college student is usually called a what?",
    "A": "sophomore",
    "B": "senior",
    "C": "freshman ",
    "D": "junior ",
    "answer": "A"
}, {
    "question": "A student who earns a J.D. can begin his or her career as a what?",
    "A": "lawyer",
    "B": "bricklayer",
    "C": "doctor",
    "D": "accountant",
    "answer": "A"
}, {
    "question": "A triptych is a work of art that is painted on how many panels?",
    "A": "two",
    "B": "three",
    "C": "five",
    "D": "eight",
    "answer": "B"
}, {
    "question": "According to a famous line from the existentialist play 'No Exit' what is hell?",
    "A": "oneself",
    "B": "other people",
    "C": "little made large",
    "D": "hued in green and blue",
    "answer": "B"
}, {
    "question": "According to a popular slogan, what state should people not 'mess with'?",
    "A": "New York",
    "B": "Texas",
    "C": "Montana",
    "D": "Rhode Island",
    "answer": "B"
}, {
    "question": "According to a Yale University study, what smell is the most recognizable to American adults?",
    "A": "tuna",
    "B": "laundry",
    "C": "popcorn",
    "D": "coffee",
    "answer": "D"
},
{
    "question": "During which war did US troops fight the Battle of New Orleans?",
    "A": "American Revolution",
    "B": "Civil War",
    "C": "Mexican War",
    "D": "War of 1812",
    "answer": "D"
}, {
    "question": "Each year in pro baseball, the player voted as the best fielder at his position wins what?",
    "A": "a brand new car",
    "B": "the Gold Glove",
    "C": "the Silver Bat",
    "D": "the Brass Baseball",
    "answer": "B"
}, {
    "question": "Elephant tusks are made of what material?",
    "A": "coral",
    "B": "ivory",
    "C": "bone",
    "D": "calcium",
    "answer": "B"
}, {
    "question": "Excluding wisdom teeth, how many adult teeth do humans have?",
    "A": "28",
    "B": "32",
    "C": "35",
    "D": "40",
    "answer": "A"
}, {
    "question": "For a man and woman on a date, 'dutch treat' means what?",
    "A": "the man pays",
    "B": "the woman pays",
    "C": "the Dutch pay",
    "D": "each pays their own way",
    "answer": "D"
}, {
    "question": "For what purpose would you use an awl?",
    "A": "to shoot ducks",
    "B": "to polish floors",
    "C": "to make holes",
    "D": "to weigh fruit",
    "answer": "C"
}, {
    "question": "From 1971 to 1997, the Democratic Republic of Congo was known as what?",
    "A": "Zaire",
    "B": "Angola",
    "C": "Rhodesia",
    "D": "Belgian Congo",
    "answer": "A"
}, {
    "question": "From what language does the term 'R.S.V.P.' originate?",
    "A": "Russian",
    "B": "Italian",
    "C": "Portuguese",
    "D": "French",
    "answer": "D"
}, {
    "question": "From whom does the Lutheran Church get its name?",
    "A": "Martin Luther King Jr",
    "B": "Martin Luther",
    "C": "Luther Vandross",
    "D": "Lex Luthor",
    "answer": "B"
}, {
    "question": "Gerry Adams is the president of what organization?",
    "A": "Greenpeace",
    "B": "NASCAR",
    "C": "Sinn Fein",
    "D": "PLO",
    "answer": "C"
}, {
    "question": "Girls of what religious community traditionally wear bonnets?",
    "A": "Amish",
    "B": "Sikh",
    "C": "Roman Catholic",
    "D": "Christian",
    "answer": "A"
}, {
    "question": "How are actors Charlie Sheen and Emilio Estevez related?",
    "A": "they're cousins",
    "B": "they're brothers",
    "C": "they're father and son",
    "D": "they're uncle and nephew",
    "answer": "B"
}, {
    "question": "How do you express 3/4 as a decimal?",
    "A": ".25",
    "B": ".50",
    "C": ".75",
    "D": ".90",
    "answer": "C"
}, {
    "question": "How is 4:00 pm expressed in military time?",
    "A": "1600",
    "B": "004",
    "C": "0400 ",
    "D": "4:00",
    "answer": "A"
}, {
    "question": "How is the Arabic numeral for '2' written?",
    "A": "2",
    "B": "II",
    "C": "I",
    "D": "ii",
    "answer": "A"
}, {
    "question": "How is the word 'ambulance' normally written on the front of American ambulances?",
    "A": "in French",
    "B": "in reverse",
    "C": "in braille",
    "D": "in gibberish",
    "answer": "B"
}, {
    "question": "How long is a single term in the US Senate?",
    "A": "two years",
    "B": "four years",
    "C": "six years",
    "D": "eight years",
    "answer": "C"
}, {
    "question": "How long is the time on an NBA shot clock?",
    "A": "18 seconds",
    "B": "24 seconds",
    "C": "30 seconds",
    "D": "35 seconds",
    "answer": "B"
}, {
    "question": "How many $100 bills does it take to equal one million dollars?",
    "A": "one thousand",
    "B": "five thousand",
    "C": "ten thousand",
    "D": "one hundred thousand",
    "answer": "C"
}, {
    "question": "How many axles does a standard automobile have?",
    "A": "one",
    "B": "two",
    "C": "four",
    "D": "eight",
    "answer": "B"
}, {
    "question": "How many digits are in a standard Visa credit card number?",
    "A": "12",
    "B": "15",
    "C": "16",
    "D": "20",
    "answer": "C"
}, {
    "question": "How many eyes does a Giraffe have?",
    "A": "one",
    "B": "two",
    "C": "three",
    "D": "four",
    "answer": "B"
}, {
    "question": "How many innings are there in a regular Major League Baseball game?",
    "A": "seven",
    "B": "eight",
    "C": "nine",
    "D": "ten",
    "answer": "C"
}, {
    "question": "How many keys are on a standard piano?",
    "A": "20",
    "B": "54",
    "C": "88",
    "D": "100",
    "answer": "C"
}, {
    "question": "How many men has actress Elizabeth Taylor been divorced from?",
    "A": "five",
    "B": "six",
    "C": "seven",
    "D": "eight",
    "answer": "C"
}, {
    "question": "How many ounces are in a pound?",
    "A": "4",
    "B": "12",
    "C": "16",
    "D": "32",
    "answer": "C"
}, {
    "question": "How many periods are there in an ice hockey game?",
    "A": "One",
    "B": "Two",
    "C": "Three",
    "D": "Four",
    "answer": "C"
}, {
    "question": "How many quarts are there in a gallon?",
    "A": "one",
    "B": "two",
    "C": "three",
    "D": "four",
    "answer": "D"
}, {
    "question": "How many ribs are there in the human body?",
    "A": "18",
    "B": "24",
    "C": "30",
    "D": "42",
    "answer": "B"
}, {
    "question": "How many ships did Columbus set sail with on his initial voyage to the New World?",
    "A": "Two",
    "B": "Three",
    "C": "Five",
    "D": "Ten",
    "answer": "B"
}, {
    "question": "How many spikes are on the Statue of Liberty's crown?",
    "A": "five",
    "B": "seven",
    "C": "nine",
    "D": "thirteen",
    "answer": "B"
}, {
    "question": "How many stars are on the American flag?",
    "A": "13",
    "B": "48",
    "C": "50",
    "D": "51",
    "answer": "C"
}, {
    "question": "How many states were in the Confederate States of America?",
    "A": "11",
    "B": "13",
    "C": "16",
    "D": "22",
    "answer": "A"
},
]


export async function mockCreate() {

    const newQuiz = await prisma.quiz.create({
        data: {
            title: "Test Quiz",
            type: 'MULTIPLE_CHOICE',
            userId: "clqse3fcv0000imftfc1z7dfx",
            questionCount: 10,
            multipleChoiceQuiz: {
                create: {}
            }
        },
        include: {
            multipleChoiceQuiz: true
        }
    })


    const newMiltipleChocieQuiz = newQuiz.multipleChoiceQuiz;
    if (!newMiltipleChocieQuiz) return

    shuffleArray(quizesData);
    quizesData.slice(0, 10).forEach(async (quest) => {

        const newQuest = await prisma.multipleChoiceQuestion.create({
            data: {
                question: quest.question,
                multipleChoiceQuizId: newMiltipleChocieQuiz.id,
                optionsList: {
                    createMany: {
                        data: [
                            {
                                isCorrect: quest.answer === "A",
                                value: quest.A,
                                opt_index:0
                            },
                            {
                                isCorrect: quest.answer === "B",
                                value: quest.B,
                                opt_index:1
                            },
                            {
                                isCorrect: quest.answer === "C",
                                value: quest.C,
                                opt_index:2
                            },
                            {
                                isCorrect: quest.answer === "D",
                                value: quest.D,
                                opt_index:3
                            }
                        ]
                    }
                }
            }
        })
    })

    const last = await prisma.quiz.findUnique({
        where: {
            id: newQuiz.id,
        },
        include: {
            multipleChoiceQuiz: {
                include: {
                    MultipleChoiceQuestions: {
                        include: {
                            optionsList: true
                        }
                    }
                }
            }
        }
    })

    return last
}



export async function test2() {
    const quizes = await prisma.quiz.findMany({
        where: {
            userId: "clqobd2u90000im2o0kujq0cn"
        }
        , include: {
            fillInTheBlankQuiz: {
                select: {
                    _count: {
                        select: {
                            fillInTheBlankQuestions: true
                        }
                    }
                }
            },
            multipleChoiceQuiz: {
                select: {
                    _count: {
                        select: {
                            MultipleChoiceQuestions: true
                        }
                    }
                }
            }
        }
    })
    const a = quizes[0].fillInTheBlankQuiz?._count.fillInTheBlankQuestions
    const b = quizes[0].multipleChoiceQuiz?._count.MultipleChoiceQuestions
    console.log(a, "a");
    console.log(b, "b");
    console.log(JSON.stringify(quizes, null, 2));
    return quizes
}