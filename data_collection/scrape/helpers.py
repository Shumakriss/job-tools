def get_text_recursive(element):
    child_text = ""
    for child in element.contents:
        child_text += get_text_recursive(child)

    return element.get_text() + child_text
