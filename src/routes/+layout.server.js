
export const load = async ({ url, locals: { getSession } }) => {

    const title = "CX-MC Docs"
    const description = "Documentation for the development of CORENET-X Model Checker";
    const meta = {
        title,
        description,
        og: {
            "og:title": title,
            "og:description": description,
            "og:type": "website",
            "og:image": "/oglogo.png",
            "og:url": url.href,
        }
    }

    return ({
        meta: meta,
        session: await getSession(),
    })
}

