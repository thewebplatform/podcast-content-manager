# podcast-player-content-manager

A content manager system for The Web Platform Today site.

## Steps to add an episode content

- In the `episodes` folder create a file called `episode_num.json`. For example, if the episode number is **45**, then you will need to create the file called `045.json`.
- Start adding content in json format. Please take a look at the acceptable content section for more details.
- From the terminal, run the command `node index.js`.
- Once the process is complete, you will see the file `content.json` in the root directory.

## Acceptable Content

A content file should have the following keys

| key | type | Description |
|----|-----|----|
| title | String | The title of the episode |
| episode | String | The episode number |
| coverart |  String | The cover art of the episode |
| summary | String | The summary of the episode |
| mp3 | String | The location of the mp3 file |
| resources | Array of Objects | The resources used in this episode. Consists of a `title` and a `link` |

**Note**: The local mp3 file needs to be a local copy of the podcast file in the `mp3` folder. This local file will never be promoted. It is in the mp3 folder just to generate the waveform. Once the `datapoints` are generated, feel free to delete the local copy of the mp3.

Example

```json
{
  "title": "Diving into Angular 2",
  "episode": "53",
  "coverart": "http://assets.libsyn.com/content/9454132",
  "summary": "Pascal Precht (@PascalPrecht), Senior Software Engineer at Thoughtram & creator of ng-translate, chats with us about the Angular 2 and how developers can get ready today.",
  "localmp3": "../mp3/episode-53_diving-into-angular-2.mp3",
  "mp3": "https://s3.amazonaws.com/thewebplatform/episode-53_diving-into-angular-2.mp3",
  "resources": [
    {
      "title": "Angular 2",
      "link": "http://angular.io"
    },
    {
      "title": "TypeScript",
      "link": "http://www.typescriptlang.org/"
    },
    {
      "title": "Definitely Typed",
      "link": "https://github.com/DefinitelyTyped"
    }
  ]
}
```