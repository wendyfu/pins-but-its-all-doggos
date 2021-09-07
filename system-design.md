# System Design
1. Requirements
2. Workflow
3. Data Entities
4. Data API
5. Project Structure
6. Masonry Layout
7. Infinite Scroll
8. Optimization

## Requirements
- Single page application
- Content consists of cards in Masonry layout
- Infinite scroll

## Workflow
1. Fetch dog pictures
2. Populate cards
3. Listen to Infinite Scroll event 

## Data Entities
```
interface Card {
  imgUrl: string
}
```

## Data API
`https://dog.ceo/api/breeds/image/random/{num_of_dogs}`

## Project Structure
Use MVC:
- Model contains cards and manage data
- View renders Masonry layout and Infinite Scroll mechanism
- Controller works with Model / View based on input

## Masonry Layout
1. Calculate number of columns
2. Fill out the columns with cards
3. Calculate container's height
4. Adjust each column last card's height to fill out the remaining space, to prevent next card rendered in current column.

## Infinite Scroll
Naive implementation:
Listen to user scroll and when it reaches bottom, fetch the data and append to the layout

## Optimization
Infinite Scroll: sliding window
