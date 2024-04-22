/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import 'chart.js/auto'
import { useState, useEffect } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Container from 'react-bootstrap/Container'
import Song from '../components/Song'
import Artist from '../components/Artist'
import ImageList from '@mui/material/ImageList'
import { Doughnut } from 'react-chartjs-2'
import {CircularProgress, Stack, Typography} from '@mui/joy'
import moment from 'moment'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import '../style/home.css'

const options = {
  plugins: {
    legend: {
      labels: {
        color: 'white'
      },
    },
  },
};


function Home(props) {

  const [topTracks, setTopTracks] = useState([])
  const [topArtists, setTopArtists] = useState([])
  const [genreData, setGenreData] = useState(new Map())
  const [topGenres, setTopGenres] = useState([])
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Tracks',
      data: [],
      backgroundColor: []
    }]
  })

  const [pop, setPop] = useState({
    artist: 0,
    track: 0
  })

  const [loggedIn, setLoggedIn] = useState(false)

 useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://backend221final-a5efd2b7e019.herokuapp.com/fetch').catch((error)=>  setTimeout(fetchData(), '1000'));
        if (!response.ok) {
          setLoggedIn(false)
          props.login(false)
        } else {
        const data = await response.json();
        setTopTracks(data.topTracks.items);
        setTopArtists(data.topArtists.items);
        setLoggedIn(true)
        props.login(true)
        }
        
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchData();
  }, []); 

  useEffect(() =>{
    let trackAvgPop = 0
    let artistAvgPop = 0;

    const trackmap = new Map()

    topTracks.forEach((track) => {
      trackAvgPop += track.popularity
      let decade = track.album.release_date
      decade = (Math.floor(parseInt(moment(decade, 'YYYY-MM-DD').get('year'))/10)*10).toString()+'s'
      const count = trackmap.get(decade)
      if(count == undefined) {
        trackmap.set(decade, 1)
      } else {
        trackmap.set(decade, count + 1)
      }
    })
    trackAvgPop = trackAvgPop/topTracks.length
    const labels = Array.from(trackmap.keys())
    const data = Array.from(trackmap.values())
    let bg = []
    labels.forEach(()=>{
      const red = Math.floor(Math.random() * 250);
      const blue = Math.floor(Math.random() * 250);
      const green = 150;
      bg.push(`rgb(${red}, ${green}, ${blue})`)
    })
    setChartData({
      labels: labels,
    datasets: [{
      label: 'Top Tracks From This Decade',
      data: data,
      backgroundColor:bg
    }]
    })
    const artistmap = new Map()

    topArtists.forEach((artist) => {
      artistAvgPop += artist.popularity
      const genre = artist.genres[0]
      const count = artistmap.get(genre)
      if(count == undefined) {
        artistmap.set(genre, 1)
      } else {
        artistmap.set(genre, count + 1)
      }
    })
    artistAvgPop = artistAvgPop/topArtists.length
    setGenreData(artistmap);
    console.log(artistAvgPop)
    setTopGenres(Array.from(artistmap).sort((a,b) => b[1] - a[1]).slice(0,5))
    setPop({track: trackAvgPop, artist: artistAvgPop})
  },[topTracks, topArtists])



  return (
    <div className='body'> 
      {loggedIn == true ? <Container>
        <Accordion defaultActiveKey='' className='mt-3' variant='dark'>
          <Accordion.Item>
            <Accordion.Header><h3>Your Favorite Tracks</h3></Accordion.Header>
            <Accordion.Body style={{backgroundColor:'rgb(33,33,33)'}}>
              <ImageList cols={4}>
          {topTracks.map((track, index) => (
            <Song key={index} title={track.name} artist={track.artists.map(artist => artist.name).join(', ')} link={track.external_urls.spotify} imgSrc={track.album.images[1].url}popularity={track.popularity}></Song>
          ))}
              </ImageList>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Accordion defaultActiveKey=''>
          <Accordion.Item className='mt-3'>
            <Accordion.Header><h3>Your Favorite Artists</h3></Accordion.Header>
            <Accordion.Body style={{backgroundColor:'rgb(33,33,33)'}}>
              <ImageList cols={4}>
              {topArtists.map((artist, index) => (
            <Artist key={index} name={artist.name} link={artist.external_urls.spotify} imgSrc={artist.images[1].url}popularity={artist.popularity}></Artist>
          ))}
              </ImageList>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Accordion defaultActiveKey='' className='mt-3' variant='dark'>
          <Accordion.Item>
              <Accordion.Header><h3>More Details</h3></Accordion.Header>
              <Accordion.Body style={{backgroundColor:'rgb(33,33,33)'}}>
              <Stack spacing={2} alignItems='center' direction='row' margin={2}>
              <Stack style={{width:'40em', height:'40em'}} alignItems='center' direction='column'>
              <Typography style={{color:'rgb(29,185,84)', backgroundColor:'rgb(33,33,33)'}} variant='solid' level='h3' margin={2}>Your Top Tracks' Genres</Typography>
              <ListGroup style={{backgroundColor: 'none'}} as={'ol'} numbered>
                {topGenres.map((genre, index)=>(
                  <ListGroup.Item style={{backgroundColor: 'rgb(33,33,33)', color: 'rgb(29,185,84)', border: 'none'}} as={'li'} key={index}>{genre[0]}</ListGroup.Item>
                ))}
              </ListGroup>
              <Typography style={{color:'rgb(29,185,84)', backgroundColor:'rgb(33,33,33)'}} variant='solid' level='h3' margin={2}>Popularity</Typography>
                <Stack direction={'row'} spacing={3}>
                {Object.keys(pop).map((key, index)=>{
                  const val = pop[key]
                  return (
                    <CircularProgress color='success' thickness={13} sx={{ '--CircularProgress-size': '100px', color:'rgb(29,185,84)', '--CircularProgress-trackColor':'rgb(83,83,83)'}} key={index} determinate value={val}>{key}</CircularProgress>
                  )
                })}
                </Stack>
              </Stack>
              <Stack style={{width:'40em', height:'40em'}} alignItems='center' direction='column'>
              <Typography style={{color:'rgb(29,185,84)', backgroundColor:'rgb(33,33,33)'}} variant='solid' level='h3'>You by the Decade</Typography>
              <Doughnut data={chartData} options={options}></Doughnut>
              </Stack>
              </Stack>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>:
      <Stack direction={'column'} alignItems={'center'}>
        <Typography level='h1' sx={{color:'rgb(29,185,84)'}}>Welcome to Statsify!</Typography>
        <Typography level='h3' sx={{color: 'white'}}>Login to learn more about how you listen.</Typography>
        <Typography level='h3' sx={{color: 'rgb(29,185,84)'}}>Please reload the page after you're done logging in, and enjoy!</Typography>
      </Stack>
      }
    </div>
  )
}

export default Home
