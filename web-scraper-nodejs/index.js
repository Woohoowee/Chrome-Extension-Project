const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");

const scrape = async () => {
  const response = await axios.request({
    method: "GET",
    url: "https://www.voicerss.org/api/",
  });

  const $ = cheerio.load(response.data);

  const allLangName = $('[data-title="Language name:"]').text();
  const allLangCode = $('[data-title="Language code:"]').text();

  //1.create array with 49 keys by spliting string in language name
  const newobj = {};
  const keys = [];
  let temp = 0;
  let startIndex = 0;
  //console.log(allLangName);
  for (let i = 0; keys.length < 49; i++) {
    let startIndex = temp;
    if (
      allLangName[i] === ")" ||
      (allLangName[i + 1] >= "A" &&
        allLangName[i + 1] <= "Z" &&
        allLangName[i] >= "a" &&
        allLangName[i] <= "z")
    ) {
      let endIndex = i + 1;
      keys.push(allLangName.substring(startIndex, endIndex));
      temp = endIndex; //I dont know why, but it wont send back the value to next loop if adding "let"
    }
  } //end for loop
  //1.End

  //2.storing language code into array of obj for each language
  q = 0;
  keys.forEach((el, index) => {
    //newobj[el] = index;
    newobj[el] = {};
    newobj[el].LanguageCode = allLangCode.substring(q, q + 5);
    q += 5;
  });
  //console.log(newobj);
  //2.End

  //3. storing voice data
  keys.forEach((el, index) => {
    const allVoice = $('[data-title="Language name:"]')
      .filter((index, element) => $(element).text() === el)
      .nextUntil('[data-title="Default voice for a language:"]')
      .text();

    //console.log(allVoice);
    newobj[el].Voice = {};
    newobj[el].Voice.Female = [];
    newobj[el].Voice.Male = [];
    temp = 0; //dont add let
    startIndex = 0; //dont add let
    for (let i = 1; i < allVoice.length; i++) {
      if (
        allVoice[i] >= "A" &&
        allVoice[i] <= "Z" &&
        allVoice.substring(i, i + 6) === "Female"
      ) {
        newobj[el].Voice.Female.push(allVoice.substring(startIndex, i));
        //console.log("Female name", allVoice.substring(startIndex, i));
        startIndex = i + 6;
      } else if (
        allVoice[i] >= "A" &&
        allVoice[i] <= "Z" &&
        allVoice.substring(i, i + 4) === "Male"
      ) {
        newobj[el].Voice.Male.push(allVoice.substring(startIndex, i));
        //console.log("Male name", allVoice.substring(startIndex, i));
        startIndex = i + 4;
      } //end if
    } //end for loop
  }); //end keys for each loop

  //4.output json file
  const jsonData = JSON.stringify(newobj);
  fs.writeFile("scrapeOutput.json", jsonData, (err) => {
    if (err) {
      console.error("Error writing JSON file:", err);
    } else {
      console.log("JSON file has been saved.");
    }
  });
};

scrape();
