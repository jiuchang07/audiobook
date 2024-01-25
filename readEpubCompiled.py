import ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup

def extract_section(epub_path, section_title, output_file):
    # Open the EPUB file
    book = epub.read_epub(epub_path)

    # Loop through the document items
    for item in book.get_items():
        if item.get_type() == ebooklib.ITEM_DOCUMENT:
            # Use BeautifulSoup to parse HTML content
            soup = BeautifulSoup(item.content, 'html.parser')

            # Check if this document is the one we're looking for
            if soup.title and section_title in soup.title.string:
                # Extract text and clean it up
                text = soup.get_text()

                # Write the text to a file
                with open(output_file, 'w', encoding='utf-8') as file:
                    file.write(text)
                print(f"Section '{section_title}' written to {output_file}")
                return

    print(f"Section '{section_title}' not found in the EPUB.")

# Example usage
extract_section('./data/Angus Deaton - The Great Escape_ Health, Wealth, and the Origins of Inequality-Princeton University Press (2013).epub', '17_ch07.xhtml', './data/17_ch07.txt')
