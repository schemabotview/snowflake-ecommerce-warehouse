import type { Section } from '../types'

export const latin1: Section = {
  id: 'latin1',
  title: "Latin-1 returns",
  scene: 'load-latin1',
  narration:
    "Back to the returns files, and the first of their two problems: text that could not be read. Look at the side pane to see why. The returns warehouse runs an old system that writes text in Latin one, an encoding where every character is one byte. In Latin one, the letter o with two dots, in the German word for size, is a single byte, F six. U T F eight, the encoding everything else uses, writes that same letter as two bytes, and a lone F six is not valid U T F eight at all. So reading these files as U T F eight fails on every row with an accent, which is what validation found. Nothing is wrong with the data. It was simply read with the wrong contract. The editor loads the returns with the right one, F F C S V latin one, which converts each byte into the right character as it loads. And it sets on error to continue, for the second problem: the few malformed rows each month are skipped and counted, while every good row loads. The summary after the arrow shows both numbers, and the table under it is the run's answer: rows loaded, and rows rejected, which should be just the malformed ones. The second command lists the return reasons as they are now stored, in German, French and English, accents intact. The rejected rows are not lost: the files are still on the stage, and the errors can be listed any time. One source is left, and it arrives every day.",
}
