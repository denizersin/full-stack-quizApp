import { Prisma } from "@prisma/client"






type TmultipleChoiceQuiz2 = Prisma.MultipleChoiceQuizGetPayload<{
    include: {
        MultipleChoiceQuestions: {
            include: {
                optionsList: true
            }
        }
    }
}>


export type TMultipleChoiceQuiz = TmultipleChoiceQuiz2 & {

}

