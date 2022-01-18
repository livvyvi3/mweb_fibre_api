
import { providerInfoImages } from './ProviderInfoConstants'
export const LogoImage = (name) => {


    if (providerInfoImages.find(o => o.name === name)) {
        return providerInfoImages.find(o => o.name === name).url
    }


}