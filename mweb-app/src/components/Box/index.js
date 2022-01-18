
import React from 'react'
import { LogoImage } from '../../getImage'
import { Box, SimpleGrid, Image } from '@chakra-ui/react'


function Boxed({ selectedProducts }) {

    return (
        <> <SimpleGrid minChildWidth='420px' spacing='40px' >{selectedProducts.map(prod => (
            <>
                <Box maxW='md' borderWidth='1px' overflow='hidden' shadow='lg'>
                    <Image src={LogoImage(prod.provider)} />

                    <Box p='6'>
                        <Box
                            mt='1'
                            fontWeight='semibold'
                            as='h4'
                            lineHeight='tight'

                        >
                            {prod.productName}
                        </Box>
                        <Box
                            mt='1'
                            fontWeight='semibold'
                            as='h4'
                            lineHeight='tight'

                        >
                            {prod.provider}
                        </Box>
                        <Box
                            mt='1'
                            fontWeight='semibold'
                            as='h4'
                            lineHeight='tight'

                        >
                            R {prod.productRate}
                        </Box>
                    </Box>
                </Box>
            </>
        ))
        }</SimpleGrid >
        </>
    );
}

export default Boxed;