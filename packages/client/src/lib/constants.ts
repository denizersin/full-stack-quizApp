
import { QuestionType } from "@prisma/client";

export const QuestionTypeEnum = {
    MULTIPLE_CHOICE: "Multiple Choice",
    FILL_IN_THE_BLANK: "Fill In The Blank"
}
export const MultiOptionIndexEnum = {
    "A": 0,
    "B": 1,
    "C": 2,
    "D": 3,
    "E": 4
}
export const MultiOptionIndexEnum2: {
    [key: number]: string
} = {
    0: "A",
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E'
}