<script>
import Icon from "@iconify/svelte";
</script>

<div class="container">
    <div class="icon">
        <Icon icon="game-icons:thor-hammer" width="60" height="60" hFlip={1} />
    </div>
    <h1>Under Construction</h1>
    <span>
        The page you are looking for is currently in development. Please check back later.
    </span>
</div>

<style lang="scss">
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-inline: auto;
    margin-block: auto;
    max-width: 600px;
    .icon {
        animation-name: swing;
        animation-duration: 0.5s;
        animation-iteration-count: infinite;
        animation-timing-function: cubic-bezier(0.4, 0.5, 0, 1);
        @keyframes swing {
            0% {
                transform: rotate(0deg);
            }
            30% {
                transform: rotate(-60deg);
            }
            70% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(0deg);
            }
        }
    }
    h1 {
        font-size: 50px;
        font-weight: 900;
    }
    span {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 0.5rem;
        font-size: 20px;
    }
}
</style>
