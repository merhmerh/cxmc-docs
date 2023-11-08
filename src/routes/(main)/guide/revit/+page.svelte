<script>
import mdRaw from "./guide.md?raw";
import { marked } from "marked";

const md = mdRaw.replace("/static/", "./");
const html = marked.parse(md);
console.log(html);
</script>

<div class="content md">
    {@html html}
</div>

<style lang="scss">
.content {
    grid-column: 1 / -1;
    margin-inline: auto;
    width: 900px;
    display: flex;
    flex-direction: column;
    gap: 0rem !important;
}

.md {
    font-size: 15 px;
    padding-bottom: 100px;
    & :global(ol),
    & :global(ul) {
        // padding: 0;
        margin: 0;
    }
    & :global(h2) {
        padding-bottom: 0.25rem;
        border-bottom: 2px solid var(--mono-100);
    }
    & :global(h3) {
        margin-block: 1rem;
        width: fit-content;
        // border-bottom: 1px solid var(--mono-100);
    }
    & :global(h4) {
        margin-block: 0.5rem;
    }
    & :global(code) {
        padding-inline: 2px;
        padding-block: 0;
        font-size: 14px;
    }
    & :global(video) {
        margin-inline: auto;
    }
    & :global(pre) {
        background-color: var(--mono-100);
        & :global(code) {
            background-color: transparent;
        }
    }
}
</style>
