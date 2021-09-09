# System Design
1. [Requirements](https://github.com/wendyfu/pins-but-its-all-doggos/blob/master/system-design.md#requirements)
2. [Workflow](https://github.com/wendyfu/pins-but-its-all-doggos/blob/master/system-design.md#workflow)
3. [Data API](https://github.com/wendyfu/pins-but-its-all-doggos/blob/master/system-design.md#data-api)
4. [Project Structure](https://github.com/wendyfu/pins-but-its-all-doggos/blob/master/system-design.md#data-api)
5. [Masonry Layout](https://github.com/wendyfu/pins-but-its-all-doggos/blob/master/system-design.md#data-api)
6. [Infinite Scroll](https://github.com/wendyfu/pins-but-its-all-doggos/blob/master/system-design.md#data-api)
7. [Optimization](https://github.com/wendyfu/pins-but-its-all-doggos/blob/master/system-design.md#data-api)

## Requirements
- Single page application
- Content consists of cards in Masonry layout
- Infinite scroll

## Workflow
1. Fetch dog pictures
2. Populate cards
3. Listen to Infinite Scroll event 

## Data API
`https://dog.ceo/api/breeds/image/random/{num_of_dogs}`

## Project Structure
Use MVC:
- Model: fetches data
- View: renders Masonry layout and trigger Infinite Scroll mechanism
- Controller: works with Model / View based on input

## Masonry Layout
1. Calculate number of columns
2. Fill out the columns with cards
3. Calculate container's height
4. Determine order number for each card
5. Adjust each column last card's height to fill out the remaining space, to prevent next card rendered in current column.

## Infinite Scroll
Naive implementation:
Utilize [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to detect when to load more then fetch the data and append to the layout.

## Optimization
- Infinite Scroll with sliding window
