<script>
import { navigating } from "$app/stores";
</script>

{#if $navigating}
    <div class="container">
        <div class="progress" />
    </div>
{/if}

<style lang="scss">
.container {
    position: fixed;
    top: 0;
    width: 100%;
    height: 4px;
    z-index: 200;

    .progress {
        width: 0;
        transition: width 3s ease-out;
        height: 100%;
        background-color: $accent;
        animation: loading 2s forwards ease-out;

        @keyframes loading {
            0% {
                width: 0%;
            }
            25% {
                width: 0%;
            }
            100% {
                width: 90%;
            }
        }
    }
}
</style>
