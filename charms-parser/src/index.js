const { Settings, QueryEngineTool, HuggingFaceEmbedding, Ollama, SimpleDirectoryReader, VectorStoreIndex, ReActAgent } = require("llamaindex");
const fs = require('fs');

async function main() {

  Settings.llm = new Ollama({
    model: "llama3",
  });

  Settings.callbackManager.on("llm-tool-call", (event) => {
    console.log(event.detail.payload);
  });
  Settings.callbackManager.on("llm-tool-result", (event) => {
    console.log(event.detail.payload);
  });

  Settings.callbackManager.on("agent-start", (event) => {
    console.log(event.detail.payload);
  });

  Settings.callbackManager.on("retrieve", (event) => {
    console.log(event.detail.payload);
  });

  Settings.callbackManager.on("retrieve-end", (event) => {
    console.log(event.detail.payload);
  });

  Settings.callbackManager.on("retrieve-start", (event) => {
    console.log(event.detail.payload);
  });

  Settings.callbackManager.on("agent-start", (event) => {
    console.log(event.detail.payload);
  });

  Settings.embedModel = new HuggingFaceEmbedding({
    modelType: "BAAI/bge-small-en-v1.5",
    quantized: false,
  });

  const reader = new SimpleDirectoryReader();
  const documents = await reader.loadData("../data");

  const index = await VectorStoreIndex.fromDocuments(documents);


  const retriever = await index.asRetriever();

  const queryEngine = await index.asQueryEngine({
    retriever,
  });


  const tools = [
    new QueryEngineTool({
      queryEngine: queryEngine,
      metadata: {
        name: "exalted_charms_tool",
        description: `This tool can answer detailed questions about the charms of martial arts`,
      },
    }),
  ];

  const agent = new ReActAgent({ tools });

  const jsonExample = JSON.stringify([
    {
      style: "FALLING BLOSSOM STYLE",
      book: "Scroll of the Monk",
      description: "Martial artists who practice the Falling Blossom Style find their ultimate worth in service to others. Some practitioners guard the children of Dynastic masters. Others protect religious leaders or heads of state. Some Falling Blossoms wander the world seeking the one person their intuition tells them must live at all costs. The Cult of the Illuminated trains heroic mortal zealots or the occasional Dragon-Blooded convert to protect newly Exalted Lawgivers. No matter who the martial artist protects, he directs his every action in combat to ensuring that person’s safety, regardless of the cost to the Falling Blossom himself. Falling Blossom Style has an air aspect, so Dragon-Bloods aspected to Water or Air do not pay elemental surcharges for its Charms. Weapons and Armor: Swords and knives count as unarmed attacks for the purpose of Falling Blossom Style, but this fighting art is incompatible with the use of armor. Complementary Abilities: The same techniques of footwork and mobility that enable a martial artist to avoid damage also enable her to interpose herself between an attack and its intended target. To learn the Falling Blossom Style, a character must already possess at least two dots in Dodge",
      charms: [{
        "title": "LIVING SHIELD TECHNIQUE",
        "origin": "Scroll of Monk",
        "cost": "1m",
        "mins": "Martial Arts 2, Essence 1",
        "type": "Reflexive (Step 2) ",
        "keywords": "Combo-OK",
        "duration": "Instant",
        "prerequisiteCharms": "None",
        "description": "The primary technique Falling Blossom martial artists master is that of defending the body of their charge. A practitioner can take arrows and sword blows that were meant for the other person or knock him away from such attacks. The martial artist spends one mote to reflexively interpose herself between another person and his attackers as long as the character is within leaping distance. Per the normal rules, leaping distance is equal to (Strength + Athletics) yards straight up or double that horizontally, incurring a -1 DV penalty in combat. When the martial artist interposes himself thus, the attack that was intended for the other person must now contend with the martial artist’s Parry or Dodge DV. The use of Parry DV is self-explanatory, but using Dodge DV represents physically maneuvering the other person out of harm’s way. Attacks that overcome the martial artist’s DV hit the martial artist instead of her charge. This Charm serves to defend only a single person, and the martial artist must declare who she intends to protect at the beginning of combat. Once she does so, the character can defend only that person for the remainder of the scene.",
      }],
    }
  ]);

  let response = agent.chat({
    stream: true,
    message: ` The documents are a charm trre of martial Arts, each style has a tittle that end with STYLE, with this case. Each charm tree is divided in charms, each charm has a structured, split charms by style, and parse the charm tree of the martial arts style FIRST PULSE STYLE, with all charms of the style contains in the JSON, The output must be in valid JSON like the following example:  ${jsonExample}`,
  });


  for await (const chunk of response) {
    process.stdout.write(chunk.delta);
    fs.writeFile('output.json', chunk);
  }

}

main().catch(console.error);
