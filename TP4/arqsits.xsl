<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  version="2.0">

  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <xsl:result-document href="index.html">
      <html style="background-image: linear-gradient(to right, thistle, azure);" >
        <head>
          <title>Arqueossítios</title>
        </head>
        <body style="padding:20px;">
          <a name="indice"/>
          <h1 style="text-align:center;">Arqueossítios</h1>
          <ul>
            <xsl:apply-templates select="//ARQELEM" mode="indice">
              <xsl:sort select="IDENTI"/>
            </xsl:apply-templates>
          </ul>
        </body>
      </html>
    </xsl:result-document>
  <xsl:apply-templates/>
  </xsl:template>

  <!--.........................Templates para o indice e conteudo..................................-->
  <xsl:template mode="indice" match="//ARQELEM">
    <xsl:variable name="i" select="position()" />
    <li style="padding:5px;">
      <a href="http://localhost:7777/arqs/{$i}" style="color:black;">
        <xsl:value-of select="IDENTI"/>
      </a>
    </li>
    
    <!--.........................Conteudo..................................-->
    <xsl:result-document href="arqweb/arq{$i}.html">
      <html style="background-image: linear-gradient(to right, thistle, azure);">
        <head>
          <title>
            <xsl:value-of select="IDENTI"/>
          </title>
        </head>
        <body style="padding:20px;">
          <h1 style="text-align:center;"><xsl:value-of select="IDENTI"/></h1>
          <p><b>Descrição: </b><xsl:value-of select="DESCRI"/></p>
          <xsl:if test="LUGAR != ''">
            <p><b>Lugar: </b><xsl:value-of select="LUGAR"/></p>
          </xsl:if>
          <p><b>Concelho: </b><xsl:value-of select="CONCEL"/></p>
          <p><b>Freguesia: </b><xsl:value-of select="FREGUE"/></p>
          <xsl:if test="LATIT">
            <p><b>Latitude: </b><xsl:value-of select="LATIT"/></p>
          </xsl:if>
          <xsl:if test="LONGIT">
            <p><b>Longitude: </b><xsl:value-of select="LONGIT"/></p>
          </xsl:if>
          <xsl:if test="ALTITU">
            <p><b>Altitude: </b><xsl:value-of select="ALTITU"/></p>
          </xsl:if>
          <xsl:if test="ACESSO">
            <p><b>Acesso: </b><xsl:value-of select="ACESSO"/></p>
          </xsl:if>
          <xsl:if test="QUADRO">
            <xsl:if test="QUADRO != ''">
              <p><b>Quadro: </b><xsl:value-of select="Quadro"/></p>
            </xsl:if>
          </xsl:if>
          <xsl:if test="ACESSO">
            <p><b>Acesso: </b><xsl:value-of select="ACESSO"/></p>
          </xsl:if>
          <xsl:if test="TRAARQ">
            <p><b>Trabalhos arqueológicos: </b><xsl:value-of select="TRAARQ"/></p>
          </xsl:if>
          <xsl:if test="DESARQ">
            <p><b>Descrição arqueológica: </b><xsl:value-of select="DESARQ"/></p>
          </xsl:if>
          <xsl:if test="INTERP">
            <p><b>Interpretação: </b><xsl:value-of select="INTERP"/></p>
          </xsl:if>
          <xsl:if test="INTERE">
            <p><b>Interesse: </b><xsl:value-of select="INTERE"/></p>
          </xsl:if>
          <xsl:if test="DEPOSI">
            <p><b>Deposição: </b><xsl:value-of select="DEPOSI"/></p>
          </xsl:if>
          <xsl:if test="BIBLIO">
            <p><b>Bibliografia: </b><xsl:for-each select="BIBLIO"><xsl:value-of select="text()"/>; </xsl:for-each></p>
          </xsl:if>
          <xsl:if test="AUTOR">
            <p><b>Autor: </b><xsl:value-of select="AUTOR"/></p>
          </xsl:if>
          <p><b>Data: </b><xsl:value-of select="DATA"/></p>
          <address>[<a href="http://localhost:7777/arqs/*" style="color:purple;">Voltar ao índice.</a>]</address>
        </body>
      </html>
    </xsl:result-document>
  </xsl:template>

</xsl:stylesheet>
