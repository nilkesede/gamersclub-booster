export const autoAgreeRankedRules = mutations =>
  chrome.storage.sync.get( [ 'autoAgreeRankedRules' ], function ( result ) {
    if ( result.autoAgreeRankedRules ) {
      $.each( mutations, ( i, mutation ) => {
        const addedNodes = $( mutation.addedNodes );
        const selector = '.RankedRules__button';
        const concordarButton = addedNodes.find( selector ).addBack( selector );
        if ( concordarButton && concordarButton.length ) {
          concordarButton[0].click();
        }
      } );
    }
  } );
