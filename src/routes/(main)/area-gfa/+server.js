import { json } from '@sveltejs/kit'

export async function GET() {
    const resp = await fetch('https://gfasync-mljlk3jxzq-as.a.run.app')
    const result = await resp.json()
    return json(result)
}
