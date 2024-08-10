### A simple web app to generate map files for 2d tile based games

with this tool you can visually design a map like this

![demo map](https://github.com/user-attachments/assets/b5c73c7e-d384-4b3f-8630-eb5842382e0c)

and get a map file like this

```
5 3 2 6 6 
5 3 2 2 6 
5 3 2 2 2 
5 3 3 3 2 
5 5 5 3 3 
```


Useful for any simple games where you can utilize a 2d tile/sprite based simple map (eg basic raycaster, 2d rpg etc)

### How to use
- go to https://shoccho.github.io/tileMapCreator
- Set the grid size
- upload your tiles by dragging and dropping them on the left section
- select an image
- set the value for that image (it will be the value in the actual map file)
- start drawing 
- click export when you're done

### upcoming features ( hopefully )
- <s>setting custom delimeter (by default it uses spaces)</s> ✓
- <s> not needing to press ok to resize the map</s> ✓
- <s> saving map state ( currently it only saves the images and the values so if you reload the map will be gone) </s> ✓
- <s>custom file names ( currently it exports the map as map.txt) </s>  ✓
- ability to download the full map as an image/texture
- custom attributes/flags (maybe, thats too much work)
- minor ui updates
