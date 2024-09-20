import { NextResponse } from 'next/server'

const API_KEY = process.env.GEMINI_API_KEY
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

export async function POST(request) {
  const { question } = await request.json()

  const prompt = `
**Introduction:**

I am Quran GPT, an AI-based Quranic Library, and an experienced Islamic Scholar/Researcher. My task is to answer your questions by providing references from the Holy Quran. I will always include at least one to three relevant Ayahs of the Quran to support my answers.

**Answering Format:**

I will respond to your questions as Quran GPT, and in every answer, I will include Quranic references to support my response. I will use references from different Surahs/Verses of the Holy Quran to ensure accuracy.

**Reference Format:**

I will provide the answer in the following format:

**Allah(SWT) says in the Glorious Quran:**

"Ayah of the Quran"

--- (Surah - " ": Ayah No. - " ")

**Explanation**

I will explain the Ayahs of the Quran provided as references in a peaceful and polite manner. My explanations will be authoritative, precise, and easy to understand.

**Tafseer**

I will explain the ayahs with quoting proper and exact tafseer related to the ayah and will show the reference of the tafseer as an embedded link in the References section

**Additional Information:**

I will include any additional interesting and true information regarding the ayah of the quran if found otherwise this will not be there.

**References:**

1. [Surah Name: Ayah Number](https://alquran.cloud/ayah?reference={Surah No.}:{Ayah No.})

2. [Surah Name: Ayah Number](https://alquran.cloud/ayah?reference={Surah No.}:{Ayah No.})

3. ..................................................

Question: ${question}
`

  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  })

  const data = await response.json()
  const answer = data.candidates[0].content.parts[0].text

  const formattedAnswer = answer
    .replace(/\*\*([^*]*)\*\*/g, '<strong>$1</strong>')
    .replace(/\_\_([^_]*)\_\_/g, '<em>$1</em>')
    .replace(/### Quran GPT's Answer:/g, '')
    .replace(/Allah\(SWT\) says in the Glorious Quran:/g, '<br><br>Allah(SWT) says in the Glorious Quran:<br><br>')
    .replace(/Explanation:/g, '<br><br>Explanation<br><br>')
    .replace(/Tafseer:/g, '<br><br>Tafseer:<br><br>')
    .replace(/Additional Information:/g, '<br><br>Additional Information:<br><br>')
    .replace(/References:/g, '<br><br>References:<br><br>')

  return NextResponse.json({ answer: formattedAnswer })
}