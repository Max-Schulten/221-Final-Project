/* eslint-disable react/prop-types */
import {Button, ProgressBar } from 'react-bootstrap';
import Card from 'react-bootstrap/Card'
import '../style/style.css'


const Song = ({title, artist, link, imgSrc, popularity}) => {
    return(
        <>
        <Card  style={{ width: '20em', position: 'relative', backgroundColor:'rgb(83,83,83)' }}>
      <a href={link} target='_blank'>
        <Card.Img src={imgSrc} className="card-img" />
        <Card.ImgOverlay className="overlay justify-content-center text-center"><Button variant='dark' style={{color:'#212121', backgroundColor: '#1db954'}}>See On Spotify</Button></Card.ImgOverlay>
      </a>
      <Card.Footer style={{color: 'rgb(29,185,84)'}}>
        <h3>{title} <small>by {artist}</small></h3>
        <ProgressBar variant='success' style={{ backgroundColor: '#212121', color: 'rgb(29,185,84)' }} now={parseInt(popularity, 10)} label={<span style={{ color: 'rgb(33,33,33)' }}>Popularity</span>}/>
      </Card.Footer>
    </Card>
        </>
    );
}

export default Song;