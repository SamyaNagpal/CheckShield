const Groq = require("groq-sdk");

class GroqService {
  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async improveText(text) {
    const completion = await this.client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "Improve grammar, clarity and professionalism while preserving meaning."
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    return completion.choices[0].message.content.trim();
  }

  async improvePost(title, description) {
    const improvedTitle = await this.improveText(title);
    const improvedDescription = await this.improveText(description);

    return {
      title: improvedTitle,
      description: improvedDescription
    };
  }

  async generateSecurityTips(text) {
    const completion = await this.client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "Generate 5 short cybersecurity tips based on the provided scam description."
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    return completion.choices[0].message.content.trim();
  }
}

module.exports = new GroqService();