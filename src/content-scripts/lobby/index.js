import { fixLobbyMenu } from './fixLobbyMenu';
import { autoReady } from './autoReady';
import { readySound } from './readySound';
import { autoAgreeRankedRules } from './autoAgreeRankedRules';
import { matchInfo } from './matchInfo';
import { lobbyLink } from './lobbyLink';
import { blockList } from './blockList';
import { addCreateLobbyButton } from './addCreateLobbyButton';
import { addBlockListButton } from './addBlockListButton';
import { addAutoCompleteButton } from './addAutoCompleteButton';
import { addHeader } from './addHeader';
import { showKdr } from './showKdr';

chrome.storage.sync.get( null, function ( _result ) {
  if ( window.location.pathname.includes( 'partida' ) || window.location.pathname.includes( '/match/' ) ) {
    initLobbyPartida();
  } else {
    initLobby();
  }
} );

const initLobbyPartida = async () => {
  addBlockListButton();
};

const initLobby = async () => {
  criarObserver( '.lobby,.ranking', readySound );
  criarObserver( '.lobby,.ranking', autoAceitarReady );
  criarObserver( '#lobbyContent', fixLobbyMenu );
  criarObserver( '.lobby,.ranking', autoAgreeRankedRules );
  criarObserver( '#matchMainContainer', matchInfo );
  criarObserver( '#lobbyContent', lobbyLink );
  criarObserver( '#lobbyContent', blockList );
  criarObserver( '.list-avaliable-teams', showKdr );

  // Cria seção de cabeçalho para botões da extensão
  addHeader();
  // Clicar automáticamente no Ready, temporário.
  autoReady();
  // Feature para aceitar complete automatico
  addAutoCompleteButton();
  //Feature pra criar lobby caso full
  addCreateLobbyButton();
  // Feature para mostrar kdr dos players
  showKdr();
};

const criarObserver = ( seletor, exec ) => {
  if ( $( seletor ).length > 0 ) {
    const observer = new MutationObserver( mutations => {
      exec( mutations );
    } );
    observer.observe( $( seletor ).get( 0 ), {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    } );
  }
};
