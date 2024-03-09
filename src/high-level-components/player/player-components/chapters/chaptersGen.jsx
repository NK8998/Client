function convertToSeconds(timeString) {
  if (timeString.split(":").length < 3) {
    timeString = `0:${timeString}`;
  }
  // Split the time string into minutes and seconds
  let [hours, minutes, seconds] = timeString.split(":").map(Number);

  // Convert minutes to seconds and add to the seconds
  return hours * 3600 + minutes * 60 + seconds;
}

function extractChapters(inputString) {
  // Define the regex pattern
  const pattern = /(?:\()?(\d{1,2}:\d{2}:\d{2}|\d+:\d+)(?:\))?(?:\s-\s|\-|\s)?(.+)?/g;

  // Initialize an empty array to store the matches
  let matches = [];

  // Use regex exec method to find all matches
  let match;
  while ((match = pattern.exec(inputString)) !== null) {
    // Convert the time string to seconds
    let timeInSeconds = convertToSeconds(match[1]);

    // Store each match as an object in the matches array
    matches.push({ left: timeInSeconds, right: match[2] ? match[2].trim() : "" });
  }

  // Return the matches array
  return matches;
}

function createSegments(matches, totalTime) {
  // Initialize an empty array to store the segments
  let segmentObjs = [];

  // Initialize a variable to track if the chapters are valid
  let validChapters = true;

  // Iterate over the matches array
  for (let i = 0; i < matches.length; i++) {
    // Check if the next left value is greater than the current left value
    if (i < matches.length - 1 && matches[i].left >= matches[i + 1].left) {
      validChapters = false;
      break;
    }
    if (matches[i].left > totalTime) {
      validChapters = false;
      break;
    }

    // Create a new object for each match
    let segmentObj = {
      start: matches[i].left,
      title: matches[i].right,
      end: i < matches.length - 1 ? matches[i + 1].left : totalTime,
    };

    // Push the new object into the segmentObjs array
    segmentObjs.push(segmentObj);
  }

  // If the chapters are not valid, return a default chapters array
  if (!validChapters) {
    return [{ start: 0, title: "", end: totalTime }];
  }

  // Return the segmentObjs array
  return segmentObjs;
}

function generateChapters(string, totalTime) {
  const testMatches = extractChapters(string);
  if (testMatches.length === 0) {
    return [{ start: 0, title: "", end: totalTime }];
  }
  const segmentObjs = createSegments(testMatches, totalTime);

  segmentObjs[0].start = 0;

  return segmentObjs;
}
export default generateChapters;
