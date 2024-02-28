interface HtmlInputEvent extends Event {
    target: HTMLInputElement & EventTarget
}

interface IFile {
    id: number,
    file: File
}