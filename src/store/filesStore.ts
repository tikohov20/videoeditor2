import { defineStore } from "pinia";
import { ref } from "vue";
import { HtmlFileTypes } from "../lib/shared/types.ts";
import { parse } from "../lib/parsers";
import { getArrayBufferFromFile } from "../lib/shared/helpers.ts";

export interface ParsedFile {
    name: string,
    fileType: HtmlFileTypes,
    arrayBuffer: ArrayBuffer,
    preview: string,
    duration?: number,
}

export const useFilesStore = defineStore('filesStore', () => {
    const files = ref<ParsedFile[]>([]);
    async function parseFile(file: File) {
        const parsed = await parse(file, { width: 1, height: 1 });
        files.value.push({
            name: parsed.name,
            fileType: file.type as HtmlFileTypes,
            arrayBuffer: await getArrayBufferFromFile(file),
            preview: parsed.preview.src,
            duration: parsed.duration
        })
    }

    async function $_hydrate() {
        if(files.value.length) {
            const media = import.meta.glob('../assets/*');
            files.value = await Promise.all(files.value.map(async (item) => {
                const mediaItem = await media[`../assets/${item.name}`]() as any;
                const mediaItemUrl = mediaItem.default;

                const response = await fetch(mediaItemUrl);
                const contentType = response.headers.get('content-type')
                const blob = await response.blob();
                const file = new File([blob], item.name, { type: contentType ?? undefined  });
                const parsed = await parse(file, { width: 1, height: 1 });

                return {
                    name: file.name,
                    fileType: file.type as HtmlFileTypes,
                    arrayBuffer: ref(await getArrayBufferFromFile(file)).value, //ts bs
                    preview: parsed.preview.src, //TODO optimize, wtf...
                    duration: parsed.duration
                }
            }))
        }
    }

    return {
        $_hydrate,

        files,
        parseFile,
    }
})
