function divideStringIntoSnippets(text, MAXCHAR) {
    const sentenceEndings = ['.', '!', '?'];
    let snippets = [];
    let snippet = '';

    for (let i = 0; i < text.length; i++) {
        snippet += text[i];

        // Check if the character is a sentence ending
        if (sentenceEndings.includes(text[i])) {
            if (snippet.length > MAXCHAR) {
                // Find the last space before MAXCHAR
                let breakPoint = snippet.lastIndexOf(' ', MAXCHAR);
                snippets.push(snippet.substring(0, breakPoint).trim());

                // Start new snippet from the break point
                snippet = snippet.substring(breakPoint).trim();
                i -= (snippet.length - text[i].length); // Adjust index to avoid skipping characters
            } else {
                snippets.push(snippet.trim());
                snippet = '';
            }
        } else if (snippet.length >= MAXCHAR) {
            // If MAXCHAR is reached and it's not at a sentence ending, find the last space
            let breakPoint = snippet.lastIndexOf(' ', MAXCHAR);
            snippets.push(snippet.substring(0, breakPoint).trim());
            snippet = snippet.substring(breakPoint).trim();
            i -= (snippet.length - text[i].length); // Adjust index to avoid skipping characters
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
// const MAXCHAR = 50; // Maximum characters per snippet
// const snippets = divideStringIntoSnippets(text, MAXCHAR);
// console.log(snippets);


module.exports = divideStringIntoSnippets;
