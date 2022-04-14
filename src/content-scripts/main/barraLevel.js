import { levelRatingXP, levelColor } from '../../lib/constants';
import { retrieveWindowVariables } from '../../lib/dom';

function XpRangeFromLevel( level ) {
  return {
    minRating: levelRatingXP[level - 1],
    maxRating: levelRatingXP[level]
  };
}

const grabPlayerLastMatch = async matchUrl => {
  const response = await fetch( matchUrl );
  const data = await response.json();

  const lastMatchIndex = data.lastMatches.length - 1;
  const lastMatch = data.lastMatches[lastMatchIndex] || {};

  const playerInfo = [];
  playerInfo['name'] = data.playerInfo ? data.playerInfo.nick : undefined;
  playerInfo['level'] = parseInt( data.playerInfo.level );
  playerInfo['currentRating'] = data.playerInfo.rating;
  playerInfo['matchId'] = lastMatch.id;
  playerInfo['rating_points'] = ( lastMatch.ratingDiff || '0' ).toString();
  playerInfo['map_name'] = lastMatch.map;

  return playerInfo;
};

export const adicionarBarraLevel = async () => {
  const GC_URL = window.location.hostname;
  const windowVariables = retrieveWindowVariables( [ 'ISSUBSCRIBER', 'PLAYERID' ] );
  const isSubscriber = windowVariables.ISSUBSCRIBER;
  const playerId = windowVariables.PLAYERID;
  const playerInfo = await grabPlayerLastMatch( `https://${GC_URL}/api/box/init/${playerId}` );

  const playerLevel = playerInfo['level'];
  const currentRating = playerInfo['currentRating'];
  const ratingPoints = playerInfo['rating_points'];
  const matchId = playerInfo['matchId'];

  const minPontos = XpRangeFromLevel( playerLevel ).minRating;
  const maxPontos = XpRangeFromLevel( playerLevel ).maxRating;

  const pontosCair = minPontos - currentRating;
  const pontosSubir = maxPontos - currentRating;

  const playerNextLevel = playerLevel + 1 > 21 ? '' : playerLevel + 1;

  const colorTxt = ratingPoints.includes( '-' ) ? '#ef2f2f' : '#839800';
  const qwertText = '\nClique aqui para ir para a partida!';

  const fixedNum = ( ( ( currentRating - minPontos ) * 100 ) / ( maxPontos - minPontos ) ).toFixed( 2 ) + '%';
  const subscriberStyle = isSubscriber === 'true' ? 'subscriber' : 'nonSubscriber';

  const containerDiv = $( '<div>' ).css( {
    'display': 'flex',
    'align-items': 'center',
    'font-size': '11px',
    'justify-content': 'center',
    'width': '100%',
    'margin': '10px'
  } );

  const currentLevelSpan = $( '<span>' )
    .attr( 'title', `Skill Level ${playerLevel}` )
    .attr( 'data-tip-text', `Skill Level ${playerLevel}` )
    .css( { 'cursor': 'help', 'display': 'inline-block' } )
    .append(
      $( '<div>' )
        .attr( 'class', `PlayerLevel PlayerLevel--${playerLevel} PlayerLevel--${subscriberStyle}` )
        .css( { 'height': '24px', 'width': '24px' } )
        .append(
          $( '<div>' )
            .attr( 'class', 'PlayerLevel__background' )
            .append(
              $( '<span>' )
                .attr( 'class', 'PlayerLevel__text' )
                .text( playerLevel )
            )
        )
    );

  const nextLevelSpan = $( '<span>' )
    .attr( 'title', `Skill Level ${playerNextLevel}` )
    .attr( 'data-tip-text', `Skill Level ${playerNextLevel}` )
    .css( { 'cursor': 'help', 'display': 'inline-block' } )
    .append(
      $( '<div>' )
        .attr( 'class', `PlayerLevel PlayerLevel--${playerNextLevel} PlayerLevel--${subscriberStyle}` )
        .css( { 'height': '24px', 'width': '24px' } )
        .append(
          $( '<div>' )
            .attr( 'class', 'PlayerLevel__background' )
            .append(
              $( '<span>' )
                .attr( 'class', 'PlayerLevel__text' )
                .text( playerNextLevel )
            )
        )
    );

  const progressBarDiv = $( '<div>' )
    .css( { 'margin-right': '4px', 'margin-left': '4px', 'width': '120px' } )
    .append(
      $( '<div>' )
        .attr( 'class', 'text-light' )
        .css( { 'display': 'flex', 'justify-content': 'space-between', 'width': '100%' } )
        .append(
          $( '<div>' )
            .attr( 'class', 'text-sm text-muted bold' )
            .css( { 'align-self': 'flex-end' } )
            .append( $( '<a>' )
              .attr( 'href', matchId ? `//${GC_URL}/lobby/partida/${matchId}` : `//${GC_URL}/my-matches` )
              .append( $( '<span>' )
                .css( { 'color': colorTxt, 'cursor': 'pointer' } )
                .text( ratingPoints.includes( '-' ) ? ratingPoints : '+' + ratingPoints )
                .attr( 'title', (
                  ratingPoints.includes( '-' ) ?
                    'Pontos que você perdeu na última partida' :
                    'Pontos que você ganhou na última partida' ) + qwertText )
              )
            )
        )
        .append(
          $( '<div>' )
            .css( { 'display': 'flex', 'align-items': 'center', 'justify-content': 'flex-end' } )
            .append( $( '<span>' )
              .css( { 'cursor': 'help' } )
              .attr( 'title', 'Rating atual' )
              .text( currentRating )
            )
            .append( $( '<i>' )
              .attr( 'class', 'fas fa-chart-line' )
              .css( { 'margin-left': '4px' } )
            )
        )
    ).append(
      $( '<div>' )
        .append( $( '<div>' )
          .css( { 'margin': '1px 0px', 'height': '2px', 'width': '100%', 'background': 'rgb(75, 78, 78)' } )
          .append( $( '<div>' )
            .css( {
              'height': '100%',
              'width': fixedNum,
              'background': 'linear-gradient(to right, ' +
              levelColor[playerLevel] + ', ' +
              levelColor[playerNextLevel] || levelColor[playerLevel] + ')'
            } )
          )
        )
        .append( $( '<div>' )
          .attr( 'class', 'text-sm text-muted' )
          .css( { 'display': 'flex', 'justify-content': 'space-between' } )
          .append( $( '<span>' )
            .text( minPontos )
          )
          .append( $( '<span>' )
            .append( $( '<span>' )
              .css( { 'cursor': 'help' } )
              .attr( 'title', 'Quantidade de pontos para cair de Level' )
              .text( pontosCair )
            )
            .append( $( '<span>' )
              .css( { 'cursor': 'help' } )
              .attr( 'title', 'Quantidade de pontos para subir de Level' )
              .text( '+' + pontosSubir )
            )
          )
          .append( $( '<span>' )
            .text( maxPontos > 2998 ? '∞' : maxPontos )
          )
        )
    );

  $( '.MainHeader__navbarBlock:last' )
    .before( containerDiv.append( currentLevelSpan ).append( progressBarDiv ).append( nextLevelSpan ) );

};
