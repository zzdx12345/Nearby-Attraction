import React, { memo, useEffect, useState } from 'react'
import { Card, CardContent, Chip, styled, Typography, Box, Rating, Button } from '@mui/material'
import { DirectionsCar, LocationOn, Phone, Star, Close } from '@mui/icons-material'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector, useDispatch } from 'react-redux'
import { actions } from '../store/Reducer'

const { setOpenDetail, setDetailCond } = actions

const NearCard = memo(() => {
  
  // console.log('NearCardStart');
  const { openDetail, detailCond } = useSelector(({ MapList }) => MapList)
  const { map, isClear, isMobile } = useSelector(({ Global }) => Global)
  const dispatch = useDispatch()
  const [detail, setDetail] = useState(null)

  useEffect(()=>{
    const service = new window.google.maps.places.PlacesService(map)
    const request = {
      placeId: openDetail.place_id,
      fields: ['name', 'rating', 'formatted_phone_number', 'geometry',
      'photos', 'formatted_address', 'website', 'reviews']
    }
    service.getDetails(request, (res) => setDetail(res))
  },[openDetail, map])

  const settings = {
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    arrows: false
  }

  const render = () => {
    if (isMobile) {
      console.log(detailCond)
      return detailCond? true : false
    } else {
      return true
    }
  }

  return (
    <>
    {(render() && detail) &&
    <RootBox isClear={isClear}>
      <Slider {...settings} className='slick-root'>
        {detail.photos?.map( (item, i) =>
          <img className='slick-img' key={i} src={item.getUrl()} alt={item.name}/>
        )}
      </Slider>
      <Card elevation={6}>
        <CardContent >
          <Typography variant='h5'>{detail.name}</Typography>

          {detail.rating &&
          <FlexBox>  {/* rating */}
            <Rating 
              readOnly size='small' precision={0.1} sx={{ml:'-3px'}}
              value={Number(detail.rating)} 
              emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit"/>}
            />
            <Typography variant='subtitle1'>
              {Number(detail.rating)}
            </Typography>
          </FlexBox>
          }

          <FlexBox mt={1}>  {/* address */}
            <LocationOn sx={{ml:'-3px'}}/>
            <Typography sx={{width:'50%', textAlign: 'right', fontSize: '14px'}}>
              {detail.formatted_address}
            </Typography>
          </FlexBox>
        
          <FlexBox mt={1}>  {/* distance */}
            <DirectionsCar sx={{ml:'-3px'}}/>
            <Typography sx={{fontSize: '14px'}}>
              from you
            </Typography>
          </FlexBox>

          <FlexBox mt={1}>  {/* phone */}
            <Phone sx={{ml:'-3px'}}/>
            <Typography sx={{fontSize: '14px'}}>
              {detail.formatted_phone_number}
            </Typography>
          </FlexBox>

          <FlexBox sx={{justifyContent:'flex-end',mt:2}}>  {/* website */}
            <Chip label='WebSite' clickable sx={{px:1}} color='primary'
              onClick={()=>window.open(detail.website,'_blank')}
            />
          </FlexBox>

          <FlexBox sx={{justifyContent:'center',mt:2}}>  {/* website */}
            <Button 
              sx={{color: 'rgb(30,155,255)'}}  
              onClick={()=>window.open(detail.website,'_blank')}
            >
              Reviews
            </Button>
          </FlexBox>

          <CloseBox onClick={()=>{
            dispatch(setOpenDetail(null))
            dispatch(setDetailCond(false))
          }}>
            <Close/>
          </CloseBox>
        </CardContent>
      </Card>
    </RootBox>
    }
    </>
  )
})

export default NearCard

const RootBox = styled(Box)((props) => `
  width: 25%;
  height: 85vh;
  display: ${props.isClear? 'none' : 'block'};
  position: absolute;
  bottom: 3%;
  left: 1%;
  z-index: 1100;
  ${props.theme.breakpoints.down('sm')}{
    width: 90%;
    height: 70vh;
    bottom: 1%;
    left: 5%;
    right: 5%;
  }
    .slick-root{
      height: 45%;
      ${props.theme.breakpoints.down('sm')}{
        height: 35vh;
      }
      img{
        border-radius: 10px;
        height: 37vh;
        ${props.theme.breakpoints.down('sm')}{
          height: 35vh;
        }
      }
    }
    .MuiCard-root{
      height: 55%;
      border-radius: 8px;
      background: ${props.theme.palette.background.third};
      ${props.theme.breakpoints.down('sm')}{
        height: 50%;
        border-radius: 0 0 10px 10px;
        overflow: scroll;
      }
    }
`)
const FlexBox = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const CloseBox = styled(Box)(({theme})=>`
  width: 25px;
  height: 25px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(255,255,255,0.5);
  color: rgba(50,50,50,0.6);
  .MuiSvgIcon-root{
    font-size: 18px;
  }
`)