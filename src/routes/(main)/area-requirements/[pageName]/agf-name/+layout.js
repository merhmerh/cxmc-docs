import areaNames from './areaNames.json'
import page_content from '../page_content.json'

export function load({ }) {
    let pageContent = page_content.find(x => x.path == 'AGF_NAME')


    return ({ areaNames, pageContent })
}