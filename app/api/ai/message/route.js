import { NextResponse } from "next/server";

// Mock AI service - replace with actual AI integration
class AIService {
  async generateResponse(message, conversationHistory = []) {
    // Simulate AI processing time
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    // Simple intent detection
    const intent = this.detectIntent(message);
    const entities = this.extractEntities(message);
    const sentiment = this.analyzeSentiment(message);
    const category = this.categorizeMessage(message);

    // Generate contextual response
    const aiResponse = this.generateContextualResponse(
      message,
      intent,
      entities
    );

    return {
      content: aiResponse,
      intent,
      entities,
      sentiment,
      category,
      confidence: 0.75 + Math.random() * 0.2,
      suggestedActions: this.getSuggestedActions(intent),
      followUpQuestions: this.getFollowUpQuestions(intent),
    };
  }

  detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    if (
      lowerMessage.includes("book") ||
      lowerMessage.includes("schedule") ||
      lowerMessage.includes("session")
    ) {
      return "book_session";
    }
    if (
      lowerMessage.includes("payment") ||
      lowerMessage.includes("billing") ||
      lowerMessage.includes("charge")
    ) {
      return "payment_inquiry";
    }
    if (lowerMessage.includes("cancel") || lowerMessage.includes("refund")) {
      return "cancellation";
    }
    if (lowerMessage.includes("tutor") || lowerMessage.includes("teacher")) {
      return "tutor_inquiry";
    }
    if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("support") ||
      lowerMessage.includes("problem")
    ) {
      return "general_help";
    }
    return "general_inquiry";
  }

  extractEntities(message) {
    const entities = { subjects: [], dates: [], amounts: [] };

    // Simple entity extraction
    const subjects = [
      "math",
      "physics",
      "chemistry",
      "biology",
      "english",
      "history",
    ];
    subjects.forEach((subject) => {
      if (message.toLowerCase().includes(subject)) {
        entities.subjects.push(subject);
      }
    });

    // Extract amounts (simple regex)
    const amountMatch = message.match(/\$(\d+(?:\.\d{2})?)/);
    if (amountMatch) {
      entities.amounts.push(amountMatch[1]);
    }

    return entities;
  }

  analyzeSentiment(message) {
    const lowerMessage = message.toLowerCase();
    const positiveWords = [
      "great",
      "good",
      "excellent",
      "happy",
      "satisfied",
      "thanks",
      "love",
    ];
    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "angry",
      "frustrated",
      "hate",
      "problem",
    ];

    const positiveCount = positiveWords.filter((word) =>
      lowerMessage.includes(word)
    ).length;
    const negativeCount = negativeWords.filter((word) =>
      lowerMessage.includes(word)
    ).length;

    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  }

  categorizeMessage(message) {
    const intent = this.detectIntent(message);
    switch (intent) {
      case "book_session":
        return "booking";
      case "payment_inquiry":
      case "cancellation":
        return "payment";
      case "tutor_inquiry":
        return "general";
      default:
        return "general";
    }
  }

  generateContextualResponse(message, intent, entities) {
    switch (intent) {
      case "book_session":
        return `I'd be happy to help you book a tutoring session! ${
          entities.subjects.length > 0
            ? `I see you're interested in ${entities.subjects.join(", ")}. `
            : ""
        }What subject would you like tutoring in, and do you have a preferred time?`;

      case "payment_inquiry":
        return "I can help you with payment-related questions. Are you looking to update your payment method, check your billing history, or do you have a specific payment concern?";

      case "cancellation":
        return "I understand you'd like to cancel something. Are you looking to cancel an upcoming session, or would you like to discuss refund options? I can help guide you through the process.";

      case "tutor_inquiry":
        return "I can help you find the perfect tutor! What subject are you looking for help with? I can show you available tutors, their specialties, and help you schedule a session.";

      case "general_help":
        return "I'm here to help! I can assist you with booking sessions, finding tutors, payment questions, account settings, and more. What specifically can I help you with today?";

      default:
        return "Thank you for reaching out! I'm here to help with any questions about IvyWay tutoring services. How can I assist you today?";
    }
  }

  getSuggestedActions(intent) {
    switch (intent) {
      case "book_session":
        return [
          { text: "Find Tutors", action: "search_tutors" },
          { text: "View My Bookings", action: "view_bookings" },
        ];
      case "payment_inquiry":
        return [
          { text: "View Billing", action: "view_billing" },
          { text: "Payment Methods", action: "payment_methods" },
        ];
      case "tutor_inquiry":
        return [
          { text: "Browse Tutors", action: "browse_tutors" },
          { text: "Filter by Subject", action: "filter_subjects" },
        ];
      default:
        return [
          { text: "Book a Session", action: "book_session" },
          { text: "Contact Support", action: "contact_support" },
        ];
    }
  }

  getFollowUpQuestions(intent) {
    switch (intent) {
      case "book_session":
        return [
          "What subject are you looking for help with?",
          "Do you have a preferred time for your session?",
          "Are you looking for a one-time session or ongoing tutoring?",
        ];
      case "payment_inquiry":
        return [
          "Do you need help with a specific transaction?",
          "Would you like to update your payment method?",
          "Are you having trouble with a payment?",
        ];
      default:
        return [
          "Is there anything specific I can help you with?",
          "Would you like me to connect you with a human agent?",
        ];
    }
  }
}

const aiService = new AIService();

export async function POST(request) {
  try {
    const { message, conversationId } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { success: false, message: "Message content is required" },
        { status: 400 }
      );
    }

    // Generate unique IDs
    const newConversationId = conversationId || crypto.randomUUID();
    const userMessageId = crypto.randomUUID();
    const aiMessageId = crypto.randomUUID();

    // Get AI response
    const aiResponse = await aiService.generateResponse(message);

    // Create conversation object
    const conversation = {
      id: newConversationId,
      userId: "user-uuid", // Should come from auth token
      status: "active",
      priority: aiResponse.sentiment === "negative" ? "high" : "medium",
      tags: [aiResponse.category, aiResponse.intent],
      sentiment: aiResponse.sentiment,
      category: aiResponse.category,
      lastInteractionAt: new Date().toISOString(),
      createdAt: conversationId ? undefined : new Date().toISOString(),
    };

    // Create user message
    const userMessage = {
      id: userMessageId,
      content: message,
      senderType: "user",
      intent: aiResponse.intent,
      sentiment: aiResponse.sentiment,
      createdAt: new Date().toISOString(),
    };

    // Create AI message
    const aiMessage = {
      id: aiMessageId,
      content: aiResponse.content,
      senderType: "ai",
      confidence: aiResponse.confidence,
      model: "gpt-3.5-turbo",
      responseTime: 1200,
      metadata: {
        suggestedActions: aiResponse.suggestedActions,
        followUpQuestions: aiResponse.followUpQuestions,
      },
      createdAt: new Date().toISOString(),
    };

    // Analysis object
    const analysis = {
      intent: aiResponse.intent,
      entities: aiResponse.entities,
      sentiment: aiResponse.sentiment,
      category: aiResponse.category,
      tags: [aiResponse.category, aiResponse.intent],
      urgency: aiResponse.sentiment === "negative" ? "high" : "medium",
      confidence: aiResponse.confidence,
    };

    return NextResponse.json({
      success: true,
      conversation,
      userMessage,
      aiMessage,
      analysis,
      responseTime: 1200,
    });
  } catch (error) {
    console.error("Error in AI message endpoint:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
