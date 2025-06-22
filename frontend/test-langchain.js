#!/usr/bin/env node

// Simple test script to validate LangChain integration
// Run with: node test-langchain.js

import { langChainService } from "./src/utils/langchain.js";

async function testLangChainIntegration() {
  console.log("🧪 Testing LangChain.js Integration...\n");

  // Test configuration
  const testConfig = {
    provider: "openai",
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    apiKey: process.env.VITE_OPENAI_API_KEY, // Replace with your API key
  };

  if (!testConfig.apiKey) {
    console.error(
      "❌ No API key found. Set VITE_OPENAI_API_KEY environment variable."
    );
    process.exit(1);
  }

  try {
    // Test 1: Initialize LLM
    console.log("1️⃣ Initializing LLM...");
    await langChainService.initializeLLM(testConfig);
    console.log("✅ LLM initialized successfully");

    // Test 2: Generate reading passage
    console.log("\n2️⃣ Generating reading passage...");
    const passage = await langChainService.generateReadingPassage("technology");
    console.log("✅ Reading passage generated:");
    console.log(`   Title: ${passage.title}`);
    console.log(`   Questions: ${passage.questions.length}`);
    console.log(`   Content length: ${passage.content.length} characters`);

    // Test 3: Generate writing prompt
    console.log("\n3️⃣ Generating writing prompt...");
    const prompt = await langChainService.generateWritingPrompt("email");
    console.log("✅ Writing prompt generated:");
    console.log(`   Title: ${prompt.title}`);
    console.log(`   Time limit: ${prompt.timeLimit} minutes`);

    // Test 4: Generate speaking task
    console.log("\n4️⃣ Generating speaking task...");
    const speaking = await langChainService.generateSpeakingTask();
    console.log("✅ Speaking task generated:");
    console.log(`   Title: ${speaking.title}`);
    console.log(`   Preparation time: ${speaking.preparationTime}`);

    // Test 5: Generate listening task
    console.log("\n5️⃣ Generating listening task...");
    const listening = await langChainService.generateListeningTask();
    console.log("✅ Listening task generated:");
    console.log(`   Title: ${listening.title}`);
    console.log(`   Questions: ${listening.questions.length}`);

    // Test 6: Evaluate response
    console.log("\n6️⃣ Testing response evaluation...");
    const evaluation = await langChainService.evaluateResponse(
      "writing",
      "This is a sample response for testing purposes. It contains some basic ideas but could be improved."
    );
    console.log("✅ Response evaluation completed:");
    console.log(`   Score: ${evaluation.score}/12`);
    console.log(`   Feedback: ${evaluation.feedback.substring(0, 100)}...`);

    console.log("\n🎉 All tests passed successfully!");
    console.log("Your LangChain.js integration is working correctly.");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
}

// Run tests
testLangChainIntegration();
