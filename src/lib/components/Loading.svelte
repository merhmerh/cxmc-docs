<script>
import { onDestroy, onMount } from 'svelte';

onMount(() => {
    document.body.classList.add('overflow-hidden');
});

onDestroy(() => {
    document.body.classList.remove('overflow-hidden');
});
</script>

<div class="loading">
    <div class="icon">
        <div class="lds-ellipsis">
            <div />
            <div />
            <div />
            <div />
        </div>
    </div>
</div>

<style lang="scss">
:global(body.overflow-hidden) {
    overflow-y: hidden;
}
.loading {
    @include bg-blur;
    @include flex-center;
    z-index: 10;
    position: fixed;
    left: 0;
    width: 100%;
    height: 100%;
    padding-inline: 1rem;
    display: flex;
}

.icon {
    grid-column: 2;
    display: flex;
    justify-content: center;
    margin-top: -100px;

    .lds-ellipsis {
        position: relative;
        display: inline-block;
        width: 80px;
        height: 80px;
        div {
            position: absolute;
            top: 33px;
            width: 13px;
            height: 13px;
            border-radius: 50%;
            background-color: $main;
            animation-timing-function: cubic-bezier(0, 1, 1, 0);
        }
        div:nth-child(1) {
            left: 8px;
            animation: lds-ellipsis1 0.6s infinite;
        }
        div:nth-child(2) {
            left: 8px;
            animation: lds-ellipsis2 0.6s infinite;
        }
        div:nth-child(3) {
            left: 32px;
            animation: lds-ellipsis2 0.6s infinite;
        }
        div:nth-child(4) {
            left: 56px;
            animation: lds-ellipsis3 0.6s infinite;
        }
        @keyframes lds-ellipsis1 {
            0% {
                transform: scale(0);
            }
            100% {
                transform: scale(1);
            }
        }
        @keyframes lds-ellipsis3 {
            0% {
                transform: scale(1);
            }
            100% {
                transform: scale(0);
            }
        }
        @keyframes lds-ellipsis2 {
            0% {
                transform: translate(0, 0);
            }
            100% {
                transform: translate(24px, 0);
            }
        }
    }
}
</style>
