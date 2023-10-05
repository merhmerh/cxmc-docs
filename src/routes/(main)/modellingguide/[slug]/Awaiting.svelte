<script>
import Icon from '@iconify/svelte';
export let message;

if (message == true) {
    message = 'Loading';
}
</script>

<div class="container">
    <div class="loader">
        <div class="icon">
            <Icon icon="svg-spinners:blocks-shuffle-3" height="96" />
        </div>
        <span>{message} ...</span>
    </div>
</div>

<style lang="scss">
.container {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    @include bg-blur;

    .loader {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
        justify-content: center;
        .icon {
            color: $grey-light;
        }
        span {
            text-align: center;
            font-size: 1.5rem;
            color: $main-light;
        }
    }
}
</style>
