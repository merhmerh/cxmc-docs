<div class="container">
    <slot />
</div>

<style lang="scss">
.container {
    grid-column: 1/-1;
    width: 1100px;
    margin-inline: auto;
    @media screen and (max-width: $mobile) {
        width: 100%;
        padding-inline: 1rem;
    }
}
</style>
