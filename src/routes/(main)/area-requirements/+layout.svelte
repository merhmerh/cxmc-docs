<div class="container area-requirements">
    <slot />
</div>

<style lang="scss">
.container {
    grid-column: 1/-1;
    display: flex;
    flex-direction: column;
    width: 1100px;
    margin-inline: auto;
    gap: 1rem;
    padding-block: 2rem;
    @media screen and (max-width: $mobile) {
        width: 100%;
        padding-inline: 1rem;
    }
}
</style>
