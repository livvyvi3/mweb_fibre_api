
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { priceRange } from './Pricerange'
import Boxed from './components/Box'
import _ from "lodash";
import { Radio, RadioGroup, Stack, Checkbox } from '@chakra-ui/react'
import { Select, Box } from '@chakra-ui/react'
import { SimpleGrid } from '@chakra-ui/react'


function App() {
  const campaignsURL = "https://apigw.mweb.co.za/prod/baas/proxy/marketing/campaigns/fibre?channels=120&visibility=public"
  const promcodeProductsURL = "https://apigw.mweb.co.za/prod/baas/proxy/marketing/products/promos/"
  const [campaignsData, setCampaignData] = useState([])
  const [promcodeProducts, setPromcodeProducts] = useState([])
  const [summarizedProducts, setSuummarizedProducts] = useState([])
  const [providers, setProviders] = useState(["Vuma Reach"])
  const [value, setValue] = useState(JSON.stringify(["FTTH-MITCHELLS-PREPAID-AMBER", "VUMA-REACH-RECURRING", "VUMA-REACH-28DAY-SERVICE", "VUMA-REACH-28DAY-SERVICE-40MBPS"]))
  const [valued, setValued] = useState()
  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectedProviders, setSelectedProviders] = useState([])

  const getData = async () => {
    await axios.get(campaignsURL).then(response => {
      setCampaignData(response.data.campaigns)

    }).catch(function (response) {

      console.log(response);
    })
  }

  const getDefaulfData = async (value) => {
    await axios.get(`${promcodeProductsURL}` + JSON.parse(value).join(',') + `?sellable_online=true`).then(async response => {
      await setPromcodeProducts(response.data)
    })
  }
  const setAll = () => {
    const praid = promcodeProducts.reduce((prods, pc) => [...prods, ...getProductsFromPromo(pc)], [])
    setSuummarizedProducts(praid)
  }

  useEffect(() => {

    getData()
    getDefaulfData(value)

  }, []);
  useEffect(() => {

    setAll()

  }, [promcodeProducts])

  useEffect(() => {
    setProviders([...new Set(summarizedProducts.map(p => p.provider))])
  }, [summarizedProducts])


  //#endregion
  const getSummarizedProduct = ({ productCode, productName, productRate, subcategory }) => {
    const provider = subcategory.replace('Uncapped', '').replace('Capped', '').trim()
    return { productCode, productName, productRate, provider }
  }

  const getProductsFromPromo = (pc) => {
    const promoCode = pc.promoCode
    return pc.products.reduce((prods, p) => [...prods, getSummarizedProduct(p)], [])
  }

  const onChange = async (data) => {
    setValue(data)
    setSelectedProducts([])
    if (data && data !== '1') {
      await axios.get(`${promcodeProductsURL}` + JSON.parse(data).join(',') + `?sellable_online=true`).then(async response => {
        await setPromcodeProducts(response.data)
        await setSuummarizedProducts(promcodeProducts.reduce((prods, pc) => [...prods, ...getProductsFromPromo(pc)], []))
        let provd = providers
        console.log(provd)
        let something = [...new Set(summarizedProducts.map(p => p.provider))]
        console.log(something)
        let newCls = [...provd, ...something]
        await setProviders(newCls)

      }).catch(function (response) {
        console.log(response);
      })

    }
  }



  const onChangeSelectedProducts = (valued) => {

    setSelectedProviders([JSON.parse(valued.target.value)])
  }

  const newFunction = () => {
    const selectedProviderSet = new Set(selectedProviders)

    let selectedProducts = summarizedProducts.filter(p => selectedProviderSet.has(p.provider))

    setSelectedProducts(selectedProducts.sort((pa, pb) => pa.productRate - pb.productRate))
  }

  useEffect(() => {
    newFunction()
  }, [selectedProviders])

  const onPriceRangeChange = (event) => {

    let selectedPriceRangeLabels = event.target.value

    let selectedPriceRanges = priceRange.filter(range => selectedPriceRangeLabels.includes(range.label))

    const filterByPriceRanges = (product) => {
      // If no price range has been selected then include all products
      if (selectedPriceRanges.length === 0) {
        return true
      }

      for (const range of selectedPriceRanges) {
        const price = product.productRate
        if (price >= range.min && price <= range.max) {
          return true
        }
      }

      return false
    }

    setSelectedProducts(selectedProducts.filter(filterByPriceRanges))
  }

  return (
    <>
      <SimpleGrid>
        <Box m={3}>
          <h3>Select Fibre Campaign</h3>
          <RadioGroup onChange={onChange} value={value} >
            <Stack direction='row'>
              {campaignsData.map(camp => (<Radio value={JSON.stringify(camp.promocodes)} key={JSON.stringify(camp.promocodes)}>{camp.name}</Radio>))}
            </Stack>
          </RadioGroup>
        </Box>
        <Box m={3}>
          <h3>Fibre Providers</h3>
          <Stack spacing={[1, 5]} direction={['column', 'row']}>
            {providers.map(camp => (<Checkbox onChange={onChangeSelectedProducts} value={valued} value={JSON.stringify(camp)} key={JSON.stringify(camp)} size='md' colorScheme='blue' >
              {camp}
            </Checkbox>))}
          </Stack>
        </Box>
        <Box w='100%' m={3} >
          <>
            <Select variant='outline' placeholder="Prices" width={200} onChange={onPriceRangeChange}>
              {priceRange.map(pR => (<option value={JSON.stringify(pR.label)} key={pR.label} >{pR.label}</option>
              ))}
            </Select>
          </>
        </Box>
        <Box>
          <Boxed selectedProducts={selectedProducts} />
        </Box>
      </SimpleGrid>

    </>
  );
}

export default App;
