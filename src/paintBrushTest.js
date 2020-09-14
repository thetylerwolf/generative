import { createCanvas } from 'canvas';
import paintBrush from './brush/paintBrush';

var canvas = createCanvas(),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;

context.strokeStyle = '#000'

paintBrush(context, { x: 10, y: 10 }, { x: 100, y: 100 }, {})

document.body.append(canvas)
