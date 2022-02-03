export function autoReady() {
  setInterval( async () => {
    chrome.storage.sync.get( [ 'autoAceitarReady' ], function ( result ) {
      if ( result.autoAceitarReady ) {
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
