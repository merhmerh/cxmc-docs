<div class="container">
    <slot />
</div>

<style lang="scss">
.container {
    grid-column: 1 / -1;
    margin-inline: auto;
    width: 1000px;
    display: flex;
    flex-direction: column;
    padding-block: 2rem;
    @media screen and (max-width: $mobile) {
        width: 100%;
        padding-inline: 1rem;
    }
}
</style>
