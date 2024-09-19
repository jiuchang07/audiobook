function divideStringIntoSnippets(text, MAXCHAR) {
    const sentenceEndings = ['.', '!', '?'];
    let snippets = [];
    let snippet = '';
    let sentences = text.split(/(?<=[.!?])\s+/); // Split on sentence endings followed by space

    for (let sentence of sentences) {
        // Trim the sentence to remove leading/trailing whitespace
        sentence = sentence.trim();

        // If the current snippet is empty, initialize it with the sentence
        if (snippet.length === 0) {
            snippet = sentence;
        } else if (snippet.length + sentence.length + 1 > MAXCHAR) { // +1 for the space
            // If adding this sentence exceeds MAXCHAR, push the current snippet and start a new one
            snippets.push(snippet.trim());
            snippet = sentence; // Start new snippet with the current sentence
        } else {
            // If it’s not the first sentence, add a space before appending
            snippet += ' ' + sentence; // Append the sentence to the current snippet
        }

        // Additionally, check if the snippet itself exceeds MAXCHAR and needs splitting
        while (snippet.length > MAXCHAR) {
            // Find the last space before MAXCHAR
            let breakPoint = snippet.lastIndexOf(' ', MAXCHAR);
            if (breakPoint === -1) {
                // If no space is found, we have to cut off at MAXCHAR
                snippets.push(snippet.substring(0, MAXCHAR).trim());
                snippet = snippet.substring(MAXCHAR).trim();
            } else {
                // Push the part of the snippet up to the break point
                snippets.push(snippet.substring(0, breakPoint).trim());
                snippet = snippet.substring(breakPoint).trim();
            }
        }
    }

    // Add any remaining text as a snippet
    if (snippet.length > 0) {
        snippets.push(snippet.trim());
    }

    return snippets;
}

// Example usage
// const text = "Here's a really, really, really, really, really, really, really, really, really, really, really, really, really, really, really, really, really long sentence. Followed by a short one.";
// const MAXCHAR = 100; // Maximum characters per snippet
// const snippets = divideStringIntoSnippets(text, MAXCHAR);
// console.log(snippets);

module.exports = divideStringIntoSnippets;
