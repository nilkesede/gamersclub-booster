export function autoReady() {
  setInterval( async () => {
    chrome.storage.sync.get( [ 'autoReady' ], function ( result ) {
      if ( result.autoReady ) {
        // eslint-disable-next-line
        const readyButton = $( "button:contains('Ready')" );
        if ( readyButton.length ) {
          setTimeout( () => {
            readyButton[0].click();
            readyButton[0].trigger( 'click' );
          }, 150 );
        }
      }
    } );
  }, 300 );
}
